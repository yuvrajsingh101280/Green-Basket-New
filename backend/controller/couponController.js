
// Admin-create coupon

import Coupon from "../model/Coupon.js"
import logger from "../utils/logger.js"
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