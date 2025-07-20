import crypto from "crypto"
export const isSignatureValid = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }, secret) => {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`
    const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex")
    return expectedSignature === razorpaySignature


}