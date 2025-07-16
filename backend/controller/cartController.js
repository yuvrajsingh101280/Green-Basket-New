import Cart from "../model/Cart.js"
import Product from "../model/Product.js"
import logger from "../utils/logger.js"

export const addToCart = async (req, res) => {

    try {
        const { productId, quantity } = req.body
        const userId = req.user._id

        if (!productId || !quantity || quantity <= 0) {

            return res.status(400).json({ success: false, message: "Invalid product or quantity" })
        }

        const product = await Product.findById(productId)
        if (!product || !product.isActive) {
            return res.status(400).json({ success: false, message: "Product not found" })

        }

        let cart = await Cart.findOne({ userId })
        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] })


        } else {

            const existingItem = cart.items.find(item => item.productId.toString() === productId)
            if (existingItem) {

                existingItem.quantity += quantity


            } else {
                cart.items.push({ productId, quantity })

            }

        }
        await cart.save()
        logger.info(`product added to cart : User -- ${userId}, product - ${productId}`)
        return res.status(200).json({ success: true, message: "Items added to cart", cart })
    } catch (error) {
        logger.error(`Error adding to cart : ${error.message}`)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}
// Get Carts

export const getCart = async (req, res) => {

    try {

        const userId = req.user._id
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
        res.status(200).json({ success: true, cart: items, subtotal, totalItems });


    } catch (error) {
        logger.error(`Error getting cart: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }


}
// update the quantity
export const updateCartItemQuantity = async (req, res) => {

    try {
        const { productId, quantity } = req.body
        const userId = req.user._id
        if (!productId || quantity < 1) {
            return res.status(400).json({ success: false, message: "Invalid Data" })

        }
        const cart = await Cart.findOne({ userId })
        if (!cart) {

            return res.status(400).json({ success: false, message: "Cart not found" })
        }
        const item = cart.items.find(item => item.productId.toString() === productId)
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(400).json({ success: false, message: "Product not available anymore" });
        }

        if (!item) {
            return res.status(400).json({ success: false, message: "No Item in the cart" })

        }
        item.quantity = quantity
        await cart.save()
        logger.info(`Cart updated: User - ${userId}, Product - ${productId}, Quantity - ${quantity}`);
        res.status(200).json({ success: true, message: "Cart updated", cart });
    } catch (error) {
        logger.error(`Error updating cart item: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }


}
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

        logger.info(`Item removed from cart: User - ${userId} , product - ${productId}`)
        return res.status(200).json({ success: true, message: "Item removed", cart })


    } catch (error) {
        logger.error(`Error removing items: ${error.message}`)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}
// clear the cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id
        await Cart.findOneAndUpdate({ userId }, { items: [] })
        logger.info(`Cart cleared for user:${userId}`)
        return res.status(200).json({ success: true, message: "Cart cleared" })
    } catch (error) {
        logger.error(`Error clearing cart: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

