
// Admin-create coupon

import { FactorListInstance } from "twilio/lib/rest/verify/v2/service/entity/factor.js"
import Coupon from "../model/Coupon.js"
import logger from "../utils/logger.js"
import Order from "../model/Order.js"
// helpers
async function getUserUsageCount(userId, code) {

    return Order.countDocuments({ userId, appliedCouponCode: code, paymentStatus: { $in: ["paid", "pending"] } })




}
function validateScope(coupon, cartItems) {

    if ((!coupon.allowedProducts || coupon.allowedProducts.length === 0) && (!coupon.allowedCategories || coupon.allowedCategories.length === 0)) {

        return true

    }
    const productIds = cartItems.map(i => i.productId.toString())
    const categoryIds = cartItems.map(i => i.categoryId?.toString().filter(Boolean))
    const productAllowed = coupon.allowedProducts?.map(id => id.toString()) ?? [];
    const categoryAllowed = coupon.allowedCategories?.map(id => id.toString()) ?? [];

    const hasProductMatch = productIds.some(id => productAllowed.includes(id));
    const hasCategoryMatch = categoryIds.some(id => categoryAllowed.includes(id));

    return hasProductMatch || hasCategoryMatch;

}
function computeDiscount({ subtotal, discountPercentage, maxDiscount }) {

    const raw = (subtotal * discountPercentage) / 100
    if (maxDiscount && maxDiscount > 0) {
        return Math.min(raw, maxDiscount)

    }
    return raw


}
// Admin
export const createCoupon = async (req, res) => {

    try {

        const { code, discountPercentage, maxDiscount = 0, minOrderAmount = 0, expiryDate, isActive = true, maxGlobalUse = 0, maxUsePerUser = 1, restrictedUserIds = [], allowedCategories = [], allowedProducts = [], notes } = req.body

        if (!code || discountPercentage === null || !expiryDate) {

            return res.status(400).json({ success: false, message: "code , discountPercentage, expiryDate are required" })

        }
        const coupon = await Coupon.create({

            code: String(code).toUpperCase().trim(),
            discountPercentage,
            maxDiscount,
            minOrderAmount,
            expiryDate,
            isActive,
            maxGlobalUse,
            maxUsePerUser,
            restrictedUserIds,
            allowedCategories,
            allowedProducts, notes


        })
        res.status(201).json({ success: true, message: "Coupon createds", coupon })
        logger.info("coupon created")

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({ message: "Coupon code already exists" })


        }


        logger.error("createCoupon error", error)
        res.status(500).json({ success: false, message: "Internal server errors" })


    }




}
export const updateCoupon = async (req, res) => {

    try {
        const { id } = req.params
        const updates = { ...req.body }

        if (updates.code) {

            updates.code = String(updates.code).toUpperCase().trim()

        }
        const existingCoupon = await Coupon.findById(id)
        if (!existingCoupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        const coupon = await Coupon.findByIdAndUpdate(id, { $set: updates }, { new: true })
        logger.info(`Coupon updated successfully- ${coupon._id}`)
        return res.status(200).json({ success: true, message: "Coupon update successfully", coupon: coupon })

    } catch (error) {
        logger.error("updateCoupon error", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }


}
export const toggleCouponActive = async (req, res) => {

    try {

        const { id } = req.params
        const coupon = await Coupon.findById(id)
        if (!coupon) {

            return res.status(400).json({ success: false, message: "Coupon not found" })

        }
        coupon.isActive = !coupon.isActive
        await coupon.save()

        return res.status(200).json({ success: true, message: "coupon status updated", isActive: coupon.isActive })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal sever error" })
    }


}
export const listCoupons = async (req, res) => {

    try {
        const {
            page = 1,
            limit = 20,
            active, // "true"/"false"
            q,      // search by code
            sort = "desc", // createdAt
        } = req.query;

        const currentPage = Math.max(parseInt(page), 1);
        const perPage = Math.max(parseInt(limit), 1);
        const skip = (currentPage - 1) * perPage;
        const now = new Date();

        const query = {};
        if (active === "true") query.isActive = true;
        if (active === "false") query.isActive = false;
        if (q) query.code = { $regex: q.trim(), $options: "i" };

        const [items, total] = await Promise.all([
            Coupon.find(query).sort({ createdAt: sort === "asc" ? 1 : -1 }).skip(skip).limit(perPage),
            Coupon.countDocuments(query),
        ]);

        const summary = {
            activeCount: await Coupon.countDocuments({ isActive: true, expiryDate: { $gt: now } }),
            expiredCount: await Coupon.countDocuments({ expiryDate: { $lte: now } }),
        };

        res.status(200).json({ page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage), summary, items });
    } catch (err) {
        console.error("listCoupons error:", err);
        res.status(500).json({ message: "Failed to list coupons" });
    }


}
export const deleteCoupon = async (req, res) => {

    try {
        const { id } = req.params
        const coupon = await Coupon.findById(id)
        if (!coupon) {
            return res.status(400).json({ success: false, message: "coupon not found " })

        }
        await Coupon.findByIdAndDelete(id)
        return res.status(200).json({ success: true, message: "coupon deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }

}

// ------------user:preview/validate coupon (without applying order)
export const previewCoupon = async (req, res) => {

    try {
        const userId = req.user?._id
        const { code } = req.params
        const { subtotal, cartItems = [] } = req.body
        if (!code || subtotal == null) {
            return res.status(400).json({ success: false, message: "Code and subtotal required" })




        }

        const coupon = await Coupon.findOne({ code: String(code).toUpperCase().trim(), isActive: true })
        if (!coupon) {

            return res.status(404).json({ success: false, message: "Ivalid or Inactive coupon" })


        }
        if (coupon.isExpired()) {
            return res.status(400).json({ success: false, message: "Coupon expired" })


        }
        if (coupon.minOrderAmount && coupon.minOrderAmount > subtotal) {

            return res.status(400).json({ success: false, message: `Minimum order amount is ${coupon.minOrderAmount}` })

        }

        // per-user usage limit
        if (userId && coupon.maxUsePerUser > 0) {

            const used = await getUserUsageCount(userId, code)
            {


                if (used >= coupon.maxUsePerUser) {

                    return res.status(400).json({ success: false, message: "Coupon per usage limit reached" })

                }

            }


        }


        // global usage limit
        if (coupon.maxGlobalUse > 0 && coupon.usedCount >= coupon.maxGlobalUse) {

            return res.status(400).json({ success: false, message: "coupon has reached its global usage limit" })

        }
        // scope(allowed products/categories)
        const isEligibleScope = validateScope(coupon, cartItems)
        if (!isEligibleScope) {
            return res.status(400).json({ success: false, message: "Coupon not applicable to items in the cart" })

        }
        const discount = computeDiscount({ subtotal, discountPercentage: coupon.discountPercentage, maxDiscount: coupon.maxDiscount })
        const payable = Math.max(subtotal - discount, 0)

        return res.status(200).json({ success: true, code: coupon.code, discountPercentage: coupon.discountPercentage, discount, payable, message: "Coupon valid" })


    } catch (error) {
        console.error("previewCoupon error:", err);
        res.status(500).json({ success: false, message: "Failed to preview coupon" });

    }




}

// apply the coupon in orders


export const applyCouponInOrder = async ({ session, userId, code, subtotal, cartItems = [] }) => {

    if (!code) return { discount: 0, appliedCouponCode: null, message: null };
    const coupon = await Coupon.findOne({ code: String(code).toUpperCase().trim(), isActive: true }).session(session);
    if (!coupon) throw new Error("Invalid or inactive coupon");
    if (coupon.isExpired()) throw new Error("Coupon expired");
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) throw new Error(`Minimum order amount is ₹${coupon.minOrderAmount}`);
    if (userId && coupon.maxUsePerUser > 0) {
        const used = await getUserUsageCount(userId, coupon.code);
        if (used >= coupon.maxUsePerUser) throw new Error("Per-user coupon usage limit reached");
    }
    if (coupon.maxGlobalUse > 0 && coupon.usedCount >= coupon.maxGlobalUse) {
        throw new Error("Coupon has reached its global usage limit");
    } const isEligibleScope = validateScope(coupon, cartItems);
    if (!isEligibleScope) throw new Error("Coupon not applicable to items in cart");

    const discount = computeDiscount({ subtotal, discountPercentage: coupon.discountPercentage, maxDiscount: coupon.maxDiscount });

    // Optimistic global usage increment (safe in txn, and can be decremented if payment fails with a compensating action)
    await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } }, { session });

    return { discount, appliedCouponCode: coupon.code, message: "Coupon applied" };
}