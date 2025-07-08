import User from "../model/User.js"
import bcrypt from "bcryptjs"
import logger from "../utils/logger.js"
export const createAdmin = async (req, res) => {

    try {

        const { name, email, phone, password, } = req.body
        const existingUser = await User.findOne({ email })

        if (existingUser && existingUser.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "User is already an admin",
            });
        }

        if (existingUser) {

            existingUser.role = "admin"
            existingUser.isVerified = true
            await existingUser.save()
            logger.info(`Existing user upgraded to admin : ${existingUser._id}`)
            return res.status(200).json({ success: true, message: "Existing user upgraded to admin", admin: { ...existingUser._doc, password: undefined } })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = await User.create({ name, email, phone, password: hashedPassword, isVerified: true, role: "admin" })

        logger.info(`New admin created by admin : ${newAdmin._id}`)
        return res.status(200).json({ success: true, message: "New Admin Created", admin: { ...newAdmin._doc, password: undefined } })
    } catch (error) {
        logger.error(`Error in creating new Admin : ${error.message}`)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}

export const deleteAdmin = async (req, res) => {

    try {
        const { adminId } = req.params

        const admin = await User.findById(adminId)
        if (!admin || !admin.role === "admin") {

            return res.status(400).json({ success: false, message: "Admin not found" })

        }

        await User.findByIdAndDelete(adminId)
        logger.info(`Admin deleted successfully : ${adminId}`)
        return res.status(200).json({ success: false, message: "Admin-deleted" })

    } catch (error) {
        logger.error(`Error in deleting admin: ${error.message}`)
        return res.status(500).json({ success: false, messsage: error.message })

    }

}