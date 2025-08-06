import express from "express"
import { adminOnly } from "../middleware/adminMiddleware.js"
import protectRoute from "../middleware/protectRoute.js"

import { createCoupon } from "../controller/couponController.js"
const router = express.Router()

router.post("/create-coupon", protectRoute, adminOnly, createCoupon)

export default router