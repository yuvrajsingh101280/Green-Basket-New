import redisClient from "../config/redisClient.js"
import Cart from "../model/Cart.js"
import Product from "../model/Product.js"
import { calculateSubtotal } from "../utils/cartUtils/calculateSubtotal.js"
import logger from "../utils/logger.js"
import mongoose from "mongoose"
export const addToCart = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { productId, quantity } = req.body
        const userId = req.user._id

        if (!productId || !quantity || quantity <= 0) {
            await session.abortTransaction()
            return res.status(400).json({ success: false, message: "Invalid product or quantity" })
        }

        const product = await Product.findById(productId).session(session)
        if (!product || !product.isActive) {
            await session.abortTransaction()
            return res.status(400).json({ success: false, message: "Product not found" })

        }
        if (quantity > product.stock) {
            await session.abortTransaction()
            return res.status(400).json({ success: false, message: "Quantity exceeds available stock" });
        }

        let cart = await Cart.findOne({ userId }).session(session)
        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] })


        } else {

            const existingItem = cart.items.find(item => item.productId.toString() === productId)
            if (existingItem) {

                const newQuantity = existingItem.quantity += quantity
                if (newQuantity > product.stock) {
                    await session.abortTransaction()
                    return res.status(400).json({ success: false, message: "Total quantity exceeds stock" });
                }
                existingItem.quantity = newQuantity;
            } else {
                cart.items.push({ productId, quantity })

            }

        }
        await cart.save({ session })
        await session.commitTransaction();
        session.endSession();
        logger.info(`product added to cart : User -- ${userId}, product - ${productId}`)
        return res.status(200).json({ success: true, message: "Items added to cart", cart })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error(`Error adding to cart : ${error.message}`)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}
// Get Carts

export const getCart = async (req, res) => {

    try {

        const userId = req.user._id

        // trying to fetch from redis first


        const cachedCart = await redisClient.get(`cart:${userId}`)
        if (cachedCart) {
            return res.status(200).json(cachedCart);
        }
        // if not in reddis then from databse
        const cart = await Cart.findOne({ userId }).populate("items.productId", "name price images unit discount discountExpiresAt")
        if (!cart || cart.items.length === 0) {

            return res.status(200).json({ success: true, cart: [], subtotal: 0 })

        }
        let subtotal = 0
        const items = cart.items.filter(item => item.productId).map(({ productId, quantity }) => {

            const now = new Date()
            const isDiscountValid = productId.discount > 0 && (!productId.discountExpiresAt || new Date(productId.discountExpiresAt) > now)
            const price = isDiscountValid
                ? productId.price - (productId.price * productId.discount / 100)
                : productId.price;

            subtotal += price * quantity;

            return {
                product: productId,
                quantity,
                unitPrice: price,
                totalPrice: price * quantity,
                isDiscountApplied: isDiscountValid
            };
        })
        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
        const response = { success: true, cart: items, subtotal, totalItems };

        // 3. Store result in Redis (cache for 1 hour)
        await redisClient.set(`cart:${userId}`, response, { ex: 3600 });

        res.status(200).json(response);


    } catch (error) {
        logger.error(`Error getting cart: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }


}
// update the quantity
export const updateCartItemQuantity = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("Update request body:", req.body);

        const { productId, quantity } = req.body;
        const userId = req.user._id;

        if (!productId || quantity < 1) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Invalid Data" });
        }

        const product = await Product.findById(productId).session(session);
        if (!product || !product.isActive) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Product not available anymore" });
        }

        const cart = await Cart.findOne({ userId }).session(session);
        if (!cart) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Cart not found" });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "No Item in the cart" });
        }

        if (quantity > product.stock) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Quantity exceeds available stock" });
        }

        item.quantity = quantity;
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        logger.info(`Cart updated: User - ${userId}, Product - ${productId}, Quantity - ${quantity}`);
        res.status(200).json({ success: true, message: "Cart updated", cart });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error(`Error updating cart item: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// remove an item from the cart
export const removeFromCart = async (req, res) => {
    try {


        const { productId } = req.params
        const userId = req.user._id

        const cart = await Cart.findOneAndUpdate(


            { userId },
            { $pull: { items: { productId } } },
            { new: true }

        )
        if (!cart) {
            return res.status(400).json({ succes: false, message: "Cart not found" })

        }

        logger.info(`Item removed from cart: User - ${userId} , product - ${productId}`)
        return res.status(200).json({
            success: true, message: "Item removed", cart: {
                items: cart.items,
                totalItems: cart.items.length,
                subtotal: await calculateSubtotal(cart.items), // optional helper
            }
        })


    } catch (error) {
        logger.error(`Error removing items: ${error.message}`)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}
// clear the cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id
        const cart = await Cart.findOneAndUpdate({ userId }, { items: [] }, { new: true })
        if (!cart) {
            return res.status(400).json({ success: false, message: "Cart not found" })


        }
        logger.info(`Cart cleared for user:${userId}`)
        return res.status(200).json({
            success: true, message: "Cart cleared", cart: {
                items: [],
                totalItems: 0,
                subtotal: 0,
            }
        })
    } catch (error) {
        logger.error(`Error clearing cart: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

