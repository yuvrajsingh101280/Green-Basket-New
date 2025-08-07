import express from "express"
import { adminOnly } from "../middleware/adminMiddleware.js"
import protectRoute from "../middleware/protectRoute.js"

import { createCoupon, deleteCoupon, listCoupons, previewCoupon, toggleCouponActive, updateCoupon } from "../controller/couponController.js"
import { deleteCategory } from "../controller/categoryController.js"
const router = express.Router()

router.post("/create-coupon", protectRoute, adminOnly, createCoupon)
router.put("/update-coupon/:id", protectRoute, adminOnly, updateCoupon)
router.patch("/toggle-coupon/:id", protectRoute, adminOnly, toggleCouponActive)
router.get("/list-coupon", protectRoute, adminOnly, listCoupons)
router.delete("/delete-coupon/:id", protectRoute, adminOnly, deleteCoupon)
// user-coupon preview
router.post("/preview/:code", protectRoute, previewCoupon)
export default router