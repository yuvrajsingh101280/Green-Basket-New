import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { placeOrder, verifyRazorpayPayment } from "../controller/orderController.js"
const router = express.Router()

// place order

router.post("/place", protectRoute, placeOrder)
router.post("/verify", protectRoute, verifyRazorpayPayment)
router.get("/my-orders", protectRoute)


export default router