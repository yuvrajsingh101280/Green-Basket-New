import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({

    userId: {


        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    items: [

        { productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: Number }


    ]



}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema)
export default Cart