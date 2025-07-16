import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({

    userId: {


        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    items: [

        { productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: { type: Number, default: 1, min: 1 } }


    ]



}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema)
export default Cart