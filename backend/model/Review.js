import mongoose, { mongo } from "mongoose";
const reviewSchema = new mongoose.Schema({


    userId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true

    },
    productId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", required: true,
        index: true

    },
    rating: {
        type: Number,
        min: 1, max: 5,
        required: true

    },
    comment: { type: String, trim: true, maxLength: 2000 }


}, { timestamps: true })
// one user one review one product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true })
const Review = mongoose.model("Review", reviewSchema)
export default Review