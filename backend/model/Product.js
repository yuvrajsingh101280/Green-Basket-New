import mongoose from "mongoose"
const ProductSchema = new mongoose.Schema({

    name: {

        type: String

    },
    description: {

        type: String

    },
    price: {

        type: Number

    },
    images: [{

        url: String,
        public_id: String

    }],
    category: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",

    },
    stock: {

        type: Number

    },
    unit: {

        type: String//kg,litre,pcs

    },
    isActive: {

        type: Boolean,
        default: true,

    }



}, { timestamps: true })
const Product = mongoose.model("Product", ProductSchema)
export default Product