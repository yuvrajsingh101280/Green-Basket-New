import express from "express"
import { adminListReviews, adminSetApproval, deleteMyReview, getMyReview, getProductReviews, upsertReview } from "../controller/reviewController.js"
import protectRoute from "../middleware/protectRoute.js"
import { adminOnly } from "../middleware/adminMiddleware.js"


const router = express.Router()


// public
router.get("/product-review/:productId", getProductReviews)
// authenticated user
router.get("/my-reviews/:productId", protectRoute, getMyReview)
router.post("/add-review", protectRoute, upsertReview)
router.delete("/delete/:productId", protectRoute, deleteMyReview)
// Admin
router.get("/", adminOnly, adminListReviews)
router.patch("/:reviewId/approval", adminOnly, adminSetApproval)
export default router