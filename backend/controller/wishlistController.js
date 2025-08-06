import Product from "../model/Product.js";
import { Wishlist } from "../model/wishList.js";
import mongoose from "mongoose";
/**
 * Add product to wishlist
 */
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find wishlist or create new
        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [productId] });
        } else {
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: "Product already in wishlist" });
            }
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(200).json({ message: "Product added to wishlist", wishlist });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            id => id.toString() !== productId
        );
        await wishlist.save();

        res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
/**
 * Get user's wishlist
 */
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ userId })
            .populate("products", "name price images stock rating");

        if (!wishlist) {
            return res.status(200).json({ products: [] });
        }

        res.status(200).json({ products: wishlist.products });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
/**
 * Clear wishlist
 */
export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = [];
        await wishlist.save();

        res.status(200).json({ message: "Wishlist cleared" });
    } catch (error) {
        console.error("Error clearing wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};