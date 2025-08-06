import mongoose from "mongoose";
import Product from "../model/Product.js";
import Review from "../model/Review.js";


export async function recomputeProductRating(productId, session = null) {
    const agg = await Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId), isApproved: true } },
        { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const avg = agg[0]?.avgRating ?? 0;
    const count = agg[0]?.count ?? 0;

    // round to 1 decimal (optional)
    const rounded = Math.round(avg * 10) / 10;

    await Product.updateOne(
        { _id: productId },
        { $set: { rating: rounded, ratingsCount: count } },
        { session }
    );
}