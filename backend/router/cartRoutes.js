import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { addToCart, clearCart, getCart, removeFromCart, updateCartItemQuantity } from "../controller/cartController.js"
const router = express.Router()

router.post("/add", protectRoute, addToCart)
router.get("/getCart", protectRoute, getCart)
router.put("/update", protectRoute, updateCartItemQuantity)
router.delete("/remove/:productId", protectRoute, removeFromCart)
router.delete("/clear", protectRoute, clearCart)
export default router