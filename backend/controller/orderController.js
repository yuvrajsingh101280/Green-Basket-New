import mongoose from "mongoose"
import Address from "../model/Address.js"
import Cart from "../model/Cart.js"
import { generateOrderId } from "../utils/orderUtils/generateOrderId.js"
import Product from "../model/Product.js"
import Order from "../model/Order.js"
import { razorpay } from "../razorpay/razorpayInstance.js"
import { sendOrderConfirmationSMS, sendSMS } from "../config/twilioClient.js"
// import { isSignatureValid } from "../config/verifyRazorpaySignature.js"
import logger from "../utils/logger.js"
import User from "../model/User.js"

export const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user._id;
        const { paymentMethod, addressId } = req.body;

        if (!paymentMethod || !["cod", "online"].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Invalid payment method" });
        }

        const address = await Address.findOne({ _id: addressId, userId }).session(session);
        if (!address) {
            return res.status(400).json({ success: false, message: "Invalid or missing address" });
        }

        const cart = await Cart.findOne({ userId }).populate("items.productId").session(session);
        if (!cart || cart.items.length <= 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // calculate total
        let totalAmount = 0;
        for (const item of cart.items) {
            const product = item.productId;
            if (!product || product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product?.name}`);
            }
            totalAmount += product.price * item.quantity;
        }

        // create base order data
        const orderData = {
            userId,
            orderId: generateOrderId(),
            items: cart.items.map((item) => ({
                productId: item.productId._id,
                price: item.productId.price,
                quantity: item.quantity,
            })),
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "paid" : "pending",
            shippingAddress: addressId,
            deliveryDate: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        };

        if (paymentMethod === "cod") {
            for (const item of cart.items) {
                const result = await Product.updateOne(
                    { _id: item.productId._id, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
                if (result.modifiedCount === 0) {
                    throw new Error(`Unable to update stock for ${item.productId.name}`);
                }
            }

            const newOrder = await Order.create([orderData], { session });
            await Cart.deleteOne({ userId }, { session });
            logger.info(`COD order placed: User - ${userId}, OrderId - ${orderData.orderId}`);
            await session.commitTransaction();

            await sendOrderConfirmationSMS({
                phone: req.user.phone,
                orderId: orderData.orderId,
                totalAmount,
                deliveryDate: orderData.deliveryDate.toLocaleDateString("en-IN"),
                trackingUrl: `https://yourdomain.com/orders/${orderData.orderId}`,
            });

            return res.status(200).json({ success: true, message: "Order placed", order: newOrder[0] });
        }

        // For ONLINE: Create Razorpay Payment Link
        const razorpayLink = await razorpay.paymentLink.create({
            amount: totalAmount * 100,
            currency: "INR",
            accept_partial: false,
            description: `Payment for order ${orderData.orderId}`,
            customer: {
                name: req.user.name,
                email: req.user.email,
                contact: req.user.phone,
            },
            notify: {
                sms: true,
                email: true,
            },
            // callback_url: `https://yourdomain.com/payment-success?orderId=${orderData.orderId}`,
            // callback_method: "get",
        });
        //  Get full payment link details
        const paymentLinkDetails = await razorpay.paymentLink.fetch(razorpayLink.id);

        //  Extract razorpay_order_id
        const razorpayOrderId = paymentLinkDetails.order_id;
        const pendingOrder = await Order.create(
            [{ ...orderData, razorpayPaymentLinkId: razorpayLink.id, razorpayOrderId }],
            { session }
        );

        await session.commitTransaction();

        logger.info(`Online payment link created: User - ${userId}, OrderId - ${orderData.orderId}`);

        return res.status(200).json({
            success: true,
            message: "Payment link created",
            paymentLink: razorpayLink.short_url,
            order: pendingOrder[0],
        });
    } catch (error) {
        await session.abortTransaction();
        logger.error(`Order placement failed: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error" });
    } finally {
        session.endSession();
    }
};

export const manuallyVerifyPayment = async (req, res) => {
    const { paymentLinkId } = req.params;

    try {
        // 1. Fetch payment link status from Razorpay
        const paymentLink = await razorpay.paymentLink.fetch(paymentLinkId);

        if (paymentLink.status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment not completed yet",
                status: paymentLink.status
            });
        }

        // 2. Find associated order
        const order = await Order.findOne({ razorpayPaymentLinkId: paymentLinkId });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.paymentStatus === "paid") {
            return res.status(200).json({ success: true, message: "Order already paid" });
        }

        // 3. Update order & adjust stock
        const session = await Order.startSession();
        session.startTransaction();

        try {
            order.paymentStatus = "paid";
            order.razorpayPaymentId = paymentLink.payment_id || "manually-updated";
            await order.save({ session });

            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            await Cart.deleteOne({ userId: order.userId }, { session });

            await sendOrderConfirmationSMS({
                phone: paymentLink.customer.contact,
                orderId: order.orderId,
                totalAmount: order.totalAmount,
                deliveryDate: new Date(order.deliveryDate).toLocaleDateString("en-IN"),
                trackingUrl: `https://yourdomain.com/orders/${order.orderId}`
            });

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ success: true, message: "Order updated manually" });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ success: false, message: "Error updating order" });
        }
    } catch (error) {
        console.error(" Manual payment verify error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch from Razorpay" });
    }
};
// // verify payement

// export const verifyRazorpayPayment = async (req, res) => {
//     const session = await mongoose.startSession()
//     session.startTransaction()
//     try {
//         const userId = req.user._id
//         const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body
//         if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {

//             return res.status(400).json({ success: false, message: "Missing Razorpay payment details" })

//         }
//         const order = await Order.findOne({ razorpayOrderId, userId })
//         if (!order) {
//             return res.status(400).json({ success: false, message: "Order not found" })

//         }
//         // verify signature
//         const isValid = isSignatureValid({ razorpayOrderId, razorpayPaymentId, razorpaySignature }, process.env.RAZORPAY_KEY_SECRET)
//         if (!isValid) {

//             return res.status(400).json({ success: false, message: "Invalid payment signature" })

//         }

//         order.paymentStatus = "paid"
//         order.razorpayPaymentId = razorpayPaymentId
//         order.razorpaySignature = razorpaySignature
//         await order.save({ session })
//         // decrease the stock
//         for (const item of order.items) {

//             await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } }, { session })

//         }
//         // clear the cart
//         await Cart.deleteOne({ userId }, { session })

//         // send the confirmation sms
//         const phone = req.user.phone
//         const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")
//         const trackingUrl = `https://yourdomain.com/orders/${order.orderId}`;

//         if (phone) {
//             try {
//                 await sendOrderConfirmationSMS({ phone, orderId: order.orderId, totalAmount: order.totalAmount, deliveryDate, trackingUrl })
//             } catch (error) {
//                 console.log(error)
//             }

//         }
//         return res.status(200).json({
//             success: true, message: "Payment verified & order confirmed",
//             order

//         })
//     } catch (error) {
//         await session.abortTransaction()
//         logger.error(`payment verification failed : ${error.message}`)
//         return res.status(500).json({ success: false, message: "Intenal server error" })

//     } finally {
//         session.endSession()

//     }

// }
// get user orders(user)
export const getMyOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const isMobile = req.query.mobile === "true";

        const orders = await Order.find({ userId })
            .populate({
                path: "items.productId",
                select: isMobile
                    ? "name price images.url"
                    : "name price description images",
            })
            .populate({
                path: "shippingAddress",
                select: "street city pincode state",
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const optimizedOrders = orders.map(order => {
            const optimisedItems = order.items.map(item => {
                const product = item.productId;
                const thumbnail =
                    isMobile && product.images?.[0]?.url
                        ? product.images[0].url
                        : product.images || [];

                return {
                    ...item.toObject(),
                    productId: {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        image: thumbnail,
                    },
                };
            });

            return {
                _id: order._id,
                orderId: order.orderId,
                items: optimisedItems,
                totalAmount: order.totalAmount,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
                shippingAddress: order.shippingAddress,
            };
        });

        return res.status(200).json({
            success: true,
            page,
            totalOrders: optimizedOrders.length,
            orders: optimizedOrders,
        });
    } catch (error) {
        logger.error("Error in fetching user orders", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// get all orders(admin)
export const getAllOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            userId,
            sort = "desc"
        } = req.query;

        const currentPage = Math.max(parseInt(page), 1);
        const perPage = Math.max(parseInt(limit), 1);
        const skip = (currentPage - 1) * perPage;

        const query = {};

        if (status) query.orderStatus = status;
        if (userId) query.userId = userId;

        // Fetch orders with population
        const orders = await Order.find(query)
            .populate({ path: "userId", select: "name email phone" })
            .populate({ path: "items.productId", select: "name price images" })
            .populate({ path: "shippingAddress", select: "street city pincode state" })
            .sort({ createdAt: sort === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(perPage);

        const totalOrders = await Order.countDocuments(query);

        // Format response
        const formattedOrders = orders.map((order) => ({
            _id: order._id,
            orderId: order.orderId,
            user: order.userId,
            items: order.items.map((item) => ({
                _id: item._id,
                quantity: item.quantity,
                price: item.price,
                product: {
                    _id: item.productId?._id,
                    name: item.productId?.name,
                    price: item.productId?.price,
                    image: item.productId?.images?.[0]?.url || null,
                }
            })),
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
            shippingAddress: order.shippingAddress,
        }));

        res.status(200).json({
            success: true,
            totalOrders,
            currentPage,
            totalPages: Math.ceil(totalOrders / perPage),
            orders: formattedOrders,
        });

    } catch (error) {
        logger.error("Error in fetching all orders", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all orders"
        });
    }
};
export const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const user = req.user;

        //  Validate MongoDB ObjectId format
        if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid Order ID format" });
        }

        //  Fetch and populate order
        const order = await Order.findById(orderId)
            .populate("items.productId", "name price images")
            .populate("shippingAddress", "street city pincode state")
            .populate("userId", "name email phone");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Role-based Access Control (RBAC)
        if (
            order.userId._id.toString() !== user._id.toString() &&
            user.role !== "admin" &&
            user.role !== "super-admin"
        ) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // Format response
        const formattedOrder = {
            _id: order._id,
            orderId: order.orderId,
            user: {
                _id: order.userId._id,
                name: order.userId.name,
                email: order.userId.email,
                phone: order.userId.phone,
            },
            items: order.items.map((item) => ({
                _id: item._id,
                quantity: item.quantity,
                price: item.price,
                product: {
                    _id: item.productId?._id,
                    name: item.productId?.name,
                    price: item.productId?.price,
                    image: item.productId?.images?.[0]?.url || null,
                },
            })),
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            paymentMethod: order.paymentMethod,
            createdAt: order.createdAt,
            deliveryDate: order.deliveryDate,
            shippingAddress: order.shippingAddress,
        };

        return res.status(200).json({ success: true, order: formattedOrder });
    } catch (error) {
        logger.error(" Error fetching order by ID:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
};
export const cancelOrder = async (req, res) => {


    const session = await mongoose.startSession()
    session.startTransaction()



    try {
        const { id: orderId } = req.params
        const user = req.user

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: "Invalid Order ID format" });
        }
        const order = await Order.findById(orderId).session(session)
        if (!order) {

            return res.status(404).json({ success: false, message: "Order not found" })
        }
        const isOwner = order.userId.toString() === user._id.toString()
        const isAdmin = ["admin", "super-admin"].includes(user.role)
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel the order" })
        }
        // check if already cancelled
        if (order.orderStatus === "cancelled") {

            return res.status(400).json({ success: false, message: "Order already cancelled" })

        }
        order.orderStatus = "cancelled"
        order.paymentStatus = order.paymentMethod === "cod" ? "pending" : "refund_initiated"
        await order.save({ session })
        // Restore the inventory
        for (const item of order.items) {

            await Product.findByIdAndUpdate(
                item.productId, { $inc: { stock: item.quantity } },
                { session }


            )


        }
        await session.commitTransaction()
        session.endSession()

        const phone = user.phone || order.shippingAddress?.phone
        if (phone) {

            const message = `Order ${order.orderId || order._id} has been cancelled. Refund (if applicable) will be processed soon`
            await sendSMS(phone, message)


        }
        logger.info(`order ${order._id} cancelle by user ${user._id}`)
        return res.status(200).json({ success: true, message: "Order cancelled successfully", order })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        logger.error("Error cancelling order:", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }



}
export const updateOrderStatus = async (req, res) => {

    try {
        const { id: orderId } = req.params
        const { status: newStatus } = req.body
        const user = req.user
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: "Invalid Order ID format" });
        }
        const allowedRoles = ["admin", "super-admin"]
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ success: false, message: "Unauthorized : Admin access Only" })

        }

        const allowedStatuses = ["placed", "packed", "shipped", "delivered"]
        const validTransitions = {

            placed: ["packed"],
            packed: ["shipped"],
            shipped: ["delivered"]



        }
        // validate new status

        if (!allowedStatuses.includes(newStatus)) {

            return res.status(400).json({ success: false, message: "Invalid status provided" })

        }

        const order = await Order.findById(orderId)
        if (!order) {

            return res.status(404).json({ success: false, message: "Order not found" })


        }
        const currentStatus = order.orderStatus
        const allowedNext = validTransitions[currentStatus] || []
        // prevent invalid transition
        if (!allowedNext.includes(newStatus)) {

            return res.status(400).json({
                success: false,
                message: `Cannot transition from ${currentStatus} to ${newStatus}`

            })

        }
        if (currentStatus === newStatus) {
            return res.status(400).json({
                success: false,
                message: `Order is already marked as '${newStatus}'`
            });
        }

        // update the order status
        order.orderStatus = newStatus
        await order.save()


        // send SMS for the order update
        const phone = order.shippingAddress?.phone
        if (phone) {


            const message = `Your order ${order.orderId || order._id} status is now updated to ${newStatus.toUpperCase()}`
            await sendSMS(phone, message)

        }
        logger.info(`order ${order._id} status updated to ${newStatus} by ${user.role} (${user._id})`)
        return res.status(200).json({ success: true, message: `Order status updated to ${newStatus}`, order })
    } catch (error) {
        logger.error("Error updating order status:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }


}
export const trackOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const userId = req.user._id;


        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: "Invalid order ID format" });
        }


        const order = await Order.findById(orderId)
            .populate("items.productId", "name price images")
            .populate("shippingAddress")
            .lean(); // 🔍 read-only boost


        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }


        if (order.userId.toString() !== userId.toString()) {
            logger.warn(`Unauthorized access attempt by ${userId} on order ${orderId}`);
            return res.status(403).json({ success: false, message: "Unauthorized to access this order" });
        }


        res.status(200).json({
            success: true,
            message: "Order tracked successfully",
            order: {
                orderId: order.orderId || order._id,
                orderStatus: order.orderStatus,
                deliveryDate: order.deliveryDate,
                totalAmount: order.totalAmount,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                items: order.items,
                shippingAddress: order.shippingAddress,
                placedAt: order.createdAt,
            },
        });

        logger.info(`Order ${orderId} tracked by user ${userId}`);
    } catch (error) {
        logger.error("Error tracking order:", error);
        res.status(500).json({ success: false, message: "Failed to track order" });
    }
};
// order analyics for admin dashboard
export const getOrderSummary = async (req, res) => {

    try {
        const [orders, users] = await Promise.all([Order.find({}), User.find({})])

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayOrders = orders.filter(o => new Date(o.createdAt) >= today)
        res.status(200).json({
            success: true,
            totalOrders: orders.length,
            totalRevenue,
            totalUsers: users.length,
            todayOrders: todayOrders.length,
        });


    } catch (error) {
        console.error("Error in getOrderSummary:", error);
        res.status(500).json({ success: false, message: "Failed to get summary" });
    }

}
export const getSalesTrends = async (req, res) => {
    try {
        const trends = await Order.aggregate([
            {
                $match: { paymentStatus: "paid" }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ success: true, trends });
    } catch (error) {
        console.error("Error in getSalesTrends:", error);
        res.status(500).json({ success: false, message: "Failed to get trends" });
    }
};
export const getOrderStatusBreakdown = async (req, res) => {
    try {
        // Group orders by status and collect order IDs for each status
        const result = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 },
                    orders: { $push: { orderId: "$orderId", _id: "$_id" } }
                }
            }
        ]);

        // Format breakdown as { status: { count, orders: [...] } }
        const breakdown = {};
        result.forEach(r => {
            breakdown[r._id] = {
                count: r.count,
                orders: r.orders
            };
        });

        res.status(200).json({ success: true, breakdown });
    } catch (error) {
        console.error("Error in getOrderStatusBreakdown:", error);
        res.status(500).json({ success: false, message: "Failed to get status data" });
    }
};
export const getTopSellingProducts = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({ success: true, topProducts });
    } catch (error) {
        console.error("Error in getTopSellingProducts:", error);
        res.status(500).json({ success: false, message: "Failed to get top products" });
    }
};
export const getCustomerTypes = async (req, res) => {
    try {
        const users = await User.find({});
        const returning = [];
        const firstTime = [];

        for (let user of users) {
            const count = await Order.countDocuments({ userId: user._id });
            if (count > 1) returning.push(user._id);
            else firstTime.push(user._id);
        }

        res.status(200).json({
            success: true,
            newCustomers: firstTime.length,
            returningCustomers: returning.length,
        });
    } catch (error) {
        console.error("Error in getCustomerTypes:", error);
        res.status(500).json({ success: false, message: "Failed to get customer stats" });
    }
};
// invoice generator
// export const generateInvoice = async () => { }