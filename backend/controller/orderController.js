import mongoose from "mongoose"
import Address from "../model/Address.js"
import Cart from "../model/Cart.js"
import { generateOrderId } from "../utils/orderUtils/generateOrderId.js"
import Product from "../model/Product.js"
import Order from "../model/Order.js"
import { razorpay } from "../razorpay/razorpayInstance.js"
import { sendOrderConfirmationSMS, sendSMS } from "../config/twilioClient.js"
import { isSignatureValid } from "../config/verifyRazorpaySignature.js"
import logger from "../utils/logger.js"

export const placeOrder = async (req, res) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const userId = req.user._id
        const { paymentMethod, addressId } = req.body
        if (!paymentMethod || !["cod", "online"].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Invalid payment method" })

        }
        const address = await Address.findOne({ _id: addressId, userId }).session(session)
        if (!address) {
            return res.status(400).json({ success: false, message: "Invalid or missing address" })
        }

        const cart = await Cart.findOne({ userId }).populate("items.productId").session(session)
        if (!cart || cart.items.length <= 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" })


        }
        // calculation of total Amount
        let totalAmount = 0
        for (const item of cart.items) {


            const product = item.productId
            if (!product || product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product?.name}`)


            }
            totalAmount += product.price * item.quantity

        }
        // order data
        const orderData = {

            userId,
            orderId: generateOrderId(),
            items: cart.items.map((item) => ({
                productId: item.productId._id,
                price: item.productId.price,
                quantity: item.quantity
            })),
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "paid" : "pending"
            ,
            shippingAddress: addressId,
            deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")


        }
        // handle cod orders

        if (paymentMethod === "cod") {
            for (const item of cart.items) {

                const result = await Product.updateOne({

                    _id: item.productId._id, stock: { $gte: item.quantity }


                },
                    { $inc: { stock: -item.quantity } },
                    { session }

                )
                if (result.modifiedCount === 0) {
                    throw new Error(`unable to update stock for ${item.productId.name}`)

                }

            }
            const newOrder = await Order.create([orderData], { session })
            // clear cart
            await Cart.deleteOne({ userId }, { session })
            logger.info(`COD order placed : User - ${userId},orderId- ${orderData.orderId}`)
            await session.commitTransaction()

            // send confirmation SMS
            const user = req.user
            const deliverDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")
            const trackingUrl = `https://yourdomain.com/orders/${orderData.orderId}`;
            await sendOrderConfirmationSMS({

                phone: user.phone,
                orderId: orderData.orderId,
                totalAmount,
                deliveryDate, trackingUrl

            })
            return res.status(200).json({ success: true, message: "Order placed", order: newOrder[0] })
        }
        // handles razorpay order(online payment)
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: orderData.orderId,
            payment_capture: 1




        })
        const pendingOrder = await Order.create([{ ...orderData, razorpayOrderId: razorpayOrder.id }], { session })
        logger.info(`Onlie payment initiated : User - ${userId}, orderId- ${orderData.orderId}`)
        await session.commitTransaction()
        return res.status(200).json({ success: true, message: "Order initiated", razorpayOrder, order: pendingOrder[0], key: process.env.RAZORPAY_KEY_ID })
    } catch (error) {
        await session.abortTransaction()
        logger.error(`Order placement failed : ${error.message}`)
        return res.status(500).json({ success: false, message: "Interal server error" })
    } finally {
        session.endSession()
    }





}
// verify payement

export const verifyRazorpayPayment = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const userId = req.user._id
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {

            return res.status(400).json({ success: false, message: "Missing Razorpay payment details" })

        }
        const order = await Order.findOne({ razorpayOrderId, userId })
        if (!order) {
            return res.status(400).json({ success: false, message: "Order not found" })

        }
        // verify signature
        const isValid = isSignatureValid({ razorpayOrderId, razorpayPaymentId, razorpaySignature }, process.env.RAZORPAY_KEY_SECRET)
        if (!isValid) {

            return res.status(400).json({ success: false, message: "Invalid payment signature" })

        }

        order.paymentStatus = "paid"
        order.razorpayPaymentId = razorpayPaymentId
        order.razorpaySignature = razorpaySignature
        await order.save({ session })
        // decrease the stock
        for (const item of order.items) {

            await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } }, { session })

        }
        // clear the cart
        await Cart.deleteOne({ userId }, { session })

        // send the confirmation sms
        const phone = req.user.phone
        const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")
        const trackingUrl = `https://yourdomain.com/orders/${order.orderId}`;

        if (phone) {
            try {
                await sendOrderConfirmationSMS({ phone, orderId: order.orderId, totalAmount: order.totalAmount, deliveryDate, trackingUrl })
            } catch (error) {
                console.log(error)
            }

        }
        return res.status(200).json({
            success: true, message: "Payment verified & order confirmed",
            order

        })
    } catch (error) {
        await session.abortTransaction()
        logger.error(`payment verification failed : ${error.message}`)
        return res.status(500).json({ success: false, message: "Intenal server error" })

    } finally {
        session.endSession()

    }

}
// get user orders
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

        // ✅ Role-based Access Control (RBAC)
        if (
            order.userId._id.toString() !== user._id.toString() &&
            user.role !== "admin" &&
            user.role !== "super-admin"
        ) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // ✅ Format response
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