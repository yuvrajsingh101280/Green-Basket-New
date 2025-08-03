import crypto from "crypto";
import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Product from "../model/Product.js"; // don't forget this!
import logger from "../utils/logger.js";
import { sendOrderConfirmationSMS } from "../config/twilioClient.js";

export const handleRazorpayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    logger.info("🔔 Webhook triggered");
    console.log("🔔 Razorpay Webhook received:", req.body.event);

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

    if (signature !== expectedSignature) {
        logger.warn("❌ Invalid signature");
        return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;

    if (event === "payment_link.paid") {
        const paymentLinkId = req.body.payload.payment_link.entity.id;
        const paymentId = req.body.payload.payment.entity.id;

        logger.info(`✅ Payment received for PaymentLink: ${paymentLinkId}, Payment ID: ${paymentId}`);
        console.log("✅ PaymentLink paid:", paymentLinkId);

        const order = await Order.findOne({ razorpayPaymentLinkId: paymentLinkId });
        if (!order || order.paymentStatus === "paid") {
            logger.info("ℹ️ Order already updated or not found");
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
                phone: req.body.payload.payment.entity.contact,
                orderId: order.orderId,
                totalAmount: order.totalAmount,
                deliveryDate,
                trackingUrl: `https://yourdomain.com/orders/${order.orderId}`
            });

            await session.commitTransaction();
            logger.info(`✅ Order ${order.orderId} updated as paid and SMS sent`);
            res.status(200).json({ success: true, message: "Payment status updated" });
        } catch (error) {
            await session.abortTransaction();
            logger.error("❌ Error updating order from webhook:", error);
            res.status(500).json({ success: false, message: "DB update failed" });
        } finally {
            session.endSession();
        }
    } else {
        logger.info(`ℹ️ Ignored webhook event: ${event}`);
        res.status(200).send("Event ignored");
    }
};
