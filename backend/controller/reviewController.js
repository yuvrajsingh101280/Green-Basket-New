import mongoose from "mongoose";
import Product from "../model/Product.js";
import Review from "../model/Review.js";
import { recomputeProductRating } from "../services/reviewService.js";
// upser review (one per user per product)

export const upsertReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.user._id;
        const { productId, rating, comment } = req.body;

        // basic checks
        if (!productId || !rating) {
            return res.status(400).json({ message: "productId and rating are required" });
        }

        // ensure product exists & active
        const product = await Product.findOne({ _id: productId, isActive: true }).session(session);
        if (!product) return res.status(404).json({ message: "Product not found or inactive" });

        // upsert review
        const review = await Review.findOneAndUpdate(
            { userId, productId },
            { $set: { rating, comment: comment ?? "" } },
            { new: true, upsert: true, setDefaultsOnInsert: true, session }
        );

        await recomputeProductRating(productId, session);

        await session.commitTransaction();
        res.status(200).json({ message: "Review saved", review });
    } catch (err) {
        await session.abortTransaction();
        // handle unique index conflict gracefully
        if (err?.code === 11000) {
            return res.status(409).json({ message: "You have already reviewed this product" });
        }
        console.error("upsertReview error:", err);
        res.status(500).json({ message: "Failed to save review" });
    } finally {
        session.endSession();
    }

}
// Delete my review
export const deleteMyReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const review = await Review.findOneAndDelete({ userId, productId }, { session });
        if (!review) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Review not found" });
        }

        await recomputeProductRating(productId, session);

        await session.commitTransaction();
        res.status(200).json({ message: "Review deleted" });
    } catch (err) {
        await session.abortTransaction();
        console.error("deleteMyReview error:", err);
        res.status(500).json({ message: "Failed to delete review" });
    } finally {
        session.endSession();
    }
};

// Get reviews for a product (public)
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const {
            page = 1,
            limit = 10,
            sort = "desc", // newest first by default
        } = req.query;

        const currentPage = Math.max(parseInt(page), 1);
        const perPage = Math.max(parseInt(limit), 1);
        const skip = (currentPage - 1) * perPage;

        const [items, total] = await Promise.all([
            Review.find({ productId, isApproved: true })
                .populate("userId", "name") // keep it minimal
                .sort({ createdAt: sort === "asc" ? 1 : -1 })
                .skip(skip)
                .limit(perPage),
            Review.countDocuments({ productId, isApproved: true }),
        ]);

        res.status(200).json({
            page: currentPage,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
            reviews: items, // changed from 'items' to 'reviews'
        });
    } catch (err) {
        console.error("getProductReviews error:", err);
        res.status(500).json({ message: "Failed to get reviews" });
    }
};

// Get my review for a product (for pre-filling UI)
export const getMyReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const review = await Review.findOne({ userId, productId });
        res.status(200).json({ review });
    } catch (err) {
        console.error("getMyReview error:", err);
        res.status(500).json({ message: "Failed to get review" });
    }
};

// Admin: list reviews + moderate
export const adminListReviews = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            productId,
            userId,
            isApproved,
            sort = "desc",
        } = req.query;

        const query = {};
        if (productId) query.productId = productId;
        if (userId) query.userId = userId;
        if (isApproved !== undefined) query.isApproved = isApproved === "true";

        const currentPage = Math.max(parseInt(page), 1);
        const perPage = Math.max(parseInt(limit), 1);
        const skip = (currentPage - 1) * perPage;

        const [items, total] = await Promise.all([
            Review.find(query)
                .populate("userId", "name")
                .populate("productId", "name")
                .sort({ createdAt: sort === "asc" ? 1 : -1 })
                .skip(skip)
                .limit(perPage),
            Review.countDocuments(query),
        ]);

        res.status(200).json({
            page: currentPage,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
            items,
        });
    } catch (err) {
        console.error("adminListReviews error:", err);
        res.status(500).json({ message: "Failed to list reviews" });
    }
};

export const adminSetApproval = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { reviewId } = req.params;
        const { isApproved } = req.body;

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { $set: { isApproved: !!isApproved } },
            { new: true, session }
        );
        if (!review) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Review not found" });
        }

        // recompute for that product
        await recomputeProductRating(review.productId, session);

        await session.commitTransaction();
        res.status(200).json({ message: "Review updated", review });
    } catch (err) {
        await session.abortTransaction();
        console.error("adminSetApproval error:", err);
        res.status(500).json({ message: "Failed to update review" });
    } finally {
        session.endSession();
    }
};