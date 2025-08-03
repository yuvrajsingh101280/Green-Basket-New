import crypto from "crypto";

const razorpayOrderId = "order_R0qmB7LduKEX4r";     // your real order ID
const razorpayPaymentId = "pay_R0ubcslZyjhoam";           // get this from Razorpay dashboard
const secret = "YxpwL28U02MmADW7DHaRjnT7";              // from Razorpay Dashboard

const body = `${razorpayOrderId}|${razorpayPaymentId}`;

const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

console.log("Generated Signature:", generatedSignature);
