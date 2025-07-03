import mongoose from "mongoose"
const OrderSchema = new mongoose.Schema({


    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },


    OrderId: String,
    items: [



        {

            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            priceAtPurchase: Number,
            quantity: Number
        }


    ],

    totalAmount: Number,
    status: {




        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"

    },
    paymentStatus: {


        type: String,
        enum: ["paid", "unPaid"],
        default: "unPaid"


    },
    paymentMethod: String,
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    deliveryDate: Date



}, { timestamps: true })
const Order = mongoose.model("Order", OrderSchema)
export default Order