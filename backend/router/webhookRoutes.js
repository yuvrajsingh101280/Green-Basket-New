import express from "express"
import { handleRazorpayWebhook } from "../controller/webhookController.js"
import bodyParser from "body-parser"
const router = express.Router()


router.post("/razorpay", bodyParser.raw({ type: "application/json" }), handleRazorpayWebhook)
export default router