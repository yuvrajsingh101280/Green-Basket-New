import mongoose from "mongoose";
const CouponSchema = new mongoose.Schema({
    code: String,
    discountPercentage: Number,
    maxDiscount: Number,
    minOrderAmount: Number,
    expiryDate: Date,
    isActive: { type: Boolean, default: true }




})
const Coupon = mongoose.model("Coupon", CouponSchema)
export default Coupon