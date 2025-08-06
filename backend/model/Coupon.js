// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
        discountPercentage: { type: Number, min: 0, max: 100, required: true },
        maxDiscount: { type: Number, min: 0, default: 0 }, // 0 => no cap
        minOrderAmount: { type: Number, min: 0, default: 0 },
        expiryDate: { type: Date, required: true, index: true },
        isActive: { type: Boolean, default: true, index: true },

        // Advanced controls
        maxGlobalUse: { type: Number, min: 0, default: 0 }, // 0 => unlimited
        maxUsePerUser: { type: Number, min: 0, default: 1 }, // 0 => unlimited
        usedCount: { type: Number, default: 0 },            // global counter
        restrictedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // optional whitelist/blacklist mode
        allowedCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // optional scope
        allowedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],    // optional scope
        notes: { type: String, trim: true, maxlength: 2000 }, // for admins
    },
    { timestamps: true }
);

couponSchema.index({ code: 1 }, { unique: true });

couponSchema.methods.isExpired = function () {
    return new Date() > this.expiryDate;
};

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
