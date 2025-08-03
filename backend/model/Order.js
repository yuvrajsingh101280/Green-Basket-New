import mongoose from "mongoose"
const OrderSchema = new mongoose.Schema({


    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },


    orderId: String,
    items: [



        {

            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            price: Number,
            quantity: Number
        }


    ],

    totalAmount: { type: Number, required: true },
    orderStatus: {




        type: String,
        enum: ["placed", "packed", "shipped", "delivered", "cancelled"],
        default: "placed"

    },
    paymentStatus: {


        type: String,
        enum: ["paid", "pending", "failed", "refund_initiated"],
        default: "pending"


    },
    paymentMethod: { type: String, enum: ["online", "cod"], default: "pending" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    // ✅ Use this for Payment Links
    razorpayPaymentLinkId: String,
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    deliveryDate: Date



}, { timestamps: true })
const Order = mongoose.model("Order", OrderSchema)
export default Order