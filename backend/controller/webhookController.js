import crypto from "crypto";
import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Product from "../model/Product.js";
import logger from "../utils/logger.js";
import { sendOrderConfirmationSMS } from "../config/twilioClient.js";

export const handleRazorpayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    console.log(signature)
    // ✅ Razorpay sends raw buffer, not parsed JSON
    const rawBody = req.body;
    const bodyString = rawBody.toString()
    console.log(" Webhook triggered");
    // Log for debug
    logger.info("📦 Raw Body Buffer: " + rawBody);
    logger.info("📦 Raw Body as String: " + rawBody.toString("utf8"));
    logger.info("🧾 Received Signature: " + signature);

    // ✅ Verify signature
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");
    console.log(expectedSignature)
    if (signature !== expectedSignature) {
        console.log("Invalid signature");
        return res.status(400).send("Invalid signature");
    }

    // ✅ Now safely parse body
    const eventBody = JSON.parse(bodyString);
    const event = eventBody.event;

    console.log(` Razorpay Webhook received: ${event}`);

    if (event === "payment_link.paid") {
        const paymentLinkId = eventBody.payload.payment_link.entity.id;
        const paymentId = eventBody.payload.payment.entity.id;

        console.log(`✅ Payment received for PaymentLink: ${paymentLinkId}, Payment ID: ${paymentId}`);

        const order = await Order.findOne({ razorpayPaymentLinkId: paymentLinkId });
        if (!order || order.paymentStatus === "paid") {
            console.log("ℹ️ Order already updated or not found");
            return res.status(200).send("Already updated");
        }

        const session = await Order.startSession();
        session.startTransaction();

        try {
            order.paymentStatus = "paid";
            order.razorpayPaymentId = paymentId;
            await order.save({ session });

            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            await Cart.deleteOne({ userId: order.userId }, { session });

            const deliveryDate = new Date(order.deliveryDate).toLocaleDateString("en-IN");
            await sendOrderConfirmationSMS({
                phone: eventBody.payload.payment.entity.contact,
                orderId: order.orderId,
                totalAmount: order.totalAmount,
                deliveryDate,
                trackingUrl: `https://yourdomain.com/orders/${order.orderId}`
            });

            await session.commitTransaction();
            console.log(`✅ Order ${order.orderId} updated as paid and SMS sent`);
            res.status(200).json({ success: true, message: "Payment status updated" });
        } catch (error) {
            await session.abortTransaction();
            console.log("❌ Error updating order from webhook:", error);
            res.status(500).json({ success: false, message: "DB update failed" });
        } finally {
            session.endSession();
        }
    } else {
        console.log(`ℹ️ Ignored webhook event: ${event}`);
        res.status(200).send("Event ignored");
    }
};
