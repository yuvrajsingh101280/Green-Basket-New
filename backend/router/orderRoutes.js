import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { cancelOrder, getAllOrders, getCustomerTypes, getMyOrder, getOrderStatusBreakdown, getOrderSummary, getSalesTrends, getTopSellingProducts, manuallyVerifyPayment, placeOrder, trackOrder, updateOrderStatus } from "../controller/orderController.js"
import { adminOnly } from "../middleware/adminMiddleware.js"
const router = express.Router()

// place order

router.post("/place", protectRoute, placeOrder)
router.get("/manual-verify/:paymentLinkId", manuallyVerifyPayment);
// router.post("/verify", protectRoute, verifyRazorpayPayment)
router.get("/my-orders", protectRoute, getMyOrder)
router.put("/cancel/:id", protectRoute, cancelOrder)
router.get("/track/:id", protectRoute, trackOrder)
// accessible to logged-in users and admins
router.get("/:id", protectRoute)

// admin

router.get("/all-orders", protectRoute, adminOnly, getAllOrders)
router.patch("update-status/:id", protectRoute, adminOnly, updateOrderStatus)
// order -analytics 
router.get("/admin/summary", protectRoute, adminOnly, getOrderSummary)
router.get("/admin/sales-trends", protectRoute, adminOnly, getSalesTrends)
router.get("/admin/status-breakdown", protectRoute, adminOnly, getOrderStatusBreakdown)
router.get("/admin/top-products", protectRoute, adminOnly, getTopSellingProducts)
router.get("/admin/customer-types", protectRoute, adminOnly, getCustomerTypes)

export default router