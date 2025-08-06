import mongoose from "mongoose"
const ProductSchema = new mongoose.Schema({

    name: {

        type: String,
        required: true,
        trim: true,

    },
    description: {

        type: String,
        trim: true

    },
    price: {

        type: Number,
        required: true

    },

    discount: {
        type: Number,
        default: 0,// for discounted products filter
        min: 0,
        max: 100
    },
    discountExpiresAt: {
        type: Date,
        default: null
    },
    rating: {
        type: Number,
        default: 0, // for filtering by rating
        min: 0,
        max: 5
    },
    ratingsCount: { type: Number, default: 0 },
    images: [{

        url: String,
        public_id: String

    }],
    category: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",

    },
    stock: {

        type: Number,
        required: true

    },
    unit: {

        type: String,//kg,litre,pcs
        required: true

    },
    isActive: {

        type: Boolean,
        default: true,

    }
    ,
    isFeatured: {
        type: Boolean,
        default: false // for homepage featured section
    }, tags: [String] // e.g., ["organic", "fresh", "summer"]


}, { timestamps: true })
const Product = mongoose.model("Product", ProductSchema)
export default Product