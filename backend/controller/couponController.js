
// Admin-create coupon

import Coupon from "../model/Coupon.js"
import logger from "../utils/logger.js"

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