// Admin:Get all users

import User from "../model/User.js"
import logger from "../utils/logger.js"


export const adminGetAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password")
        res.status(200).json({ success: true, users })


    } catch (error) {
        logger.error(`Error in adminGetAllusers : ${error.message}`)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }



}



export const adminToggleUserStatus = async (req, res) => {


    try {
        const { userId } = req.body
        const user = await User.findById(userId)
        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })

        }

        user.isVerified = !user.isVerified
        await user.save()
        logger.info(`user verification toggles : ${userId}`)

        res.status(200).json({ success: true, message: `User ${user.isVerified ? "verified" : "Unverified"} successfully` })
    } catch (error) {
        logger.error(`Error in adminToggleStatus : ${error.message}`)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}
export const deleteUser = async (req, res) => {

    try {
        const { userId } = req.params
        await User.findByIdAndDelete(userId)
        logger.info(`user deleted by admin : ${userId}`)
        res.status(200).json({ success: true, message: "User deleted" })


    } catch (error) {

        logger.error(`Error in deleting user : ${error.message}`)
        res.status(500).json({ success: false, message: "Internal Server Error" })


    }


}