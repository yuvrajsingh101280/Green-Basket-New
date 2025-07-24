import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { getAllOrders, getMyOrder, placeOrder, verifyRazorpayPayment } from "../controller/orderController.js"
import { adminOnly } from "../middleware/adminMiddleware.js"
const router = express.Router()

// place order

router.post("/place", protectRoute, placeOrder)
router.post("/verify", protectRoute, verifyRazorpayPayment)
router.get("/my-orders", protectRoute, getMyOrder)
// accessible to logged-in users and admins
router.get("/:id", protectRoute)

// admin

router.get("/all-orders", protectRoute, adminOnly, getAllOrders)

export default router