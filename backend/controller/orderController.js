import mongoose from "mongoose"
import Address from "../model/Address.js"
import Cart from "../model/Cart.js"
import { generateOrderId } from "../utils/orderUtils/generateOrderId.js"
import Product from "../model/Product.js"
import Order from "../model/Order.js"
import { razorpay } from "../razorpay/razorpayInstance.js"
import { sendOrderConfirmationSMS } from "../config/twilioClient.js"
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
// verrify payement

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