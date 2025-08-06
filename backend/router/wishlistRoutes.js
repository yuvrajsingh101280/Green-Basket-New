import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { addToWishlist, clearWishlist, getWishlist, removeFromWishlist } from "../controller/wishlistController.js"
const router = express.Router()

router.post("/add-wishlist", protectRoute, addToWishlist)
router.delete("/remove-product/:id", protectRoute, removeFromWishlist)
router.get("/getwishlist", protectRoute, getWishlist)
router.delete("/clear-wishlist", protectRoute, clearWishlist)
export default router