import Address from "../model/Address.js"
import User from "../model/User.js"
import logger from "../utils/logger.js"

export const getUserData = async (req, res) => {



    try {
        const user = req.user
        if (!user) {
            logger.warn("User not found in request")
            return res.status(400).json({ success: false, message: "User not found" })

        }
        logger.info(`Fetched user data successfully for user ID - ${user._id || "N/A"}`)
        return res.status(200).json({ success: true, user })
    } catch (error) {
        logger.error(`Error in fetching user : ${error.message}`)
        res.status(500).json({ success: false, message: "Internal server error" })
    }



}
// Update the user profile (name, phone , profile pic)
export const updateUserProfile = async (req, res) => {


    try {

        const userId = req.user._id
        const { name, phone, profilePic } = req.body
        const updatedUser = await User.findByIdAndUpdate(userId, { name, phone, profilePic }, { new: true }).select("-password")

        logger.info(`Updated user profile for ID: ${userId}`)
        return res.status(200).json({ success: true, message: "User updated", user: updatedUser })
    } catch (error) {
        logger.error(`Error in updating profile ${error.message}`)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }


}
// Delete Account
export const deleteUserAccount = async (req, res) => {


    try {
        const userId = req.user._id

        await User.findByIdAndDelete(userId)
        res.clearCookie("token")
        logger.info(`user account deleted ${userId}`)
        res.status(200).json({ success: true, message: "Account delted successfully" })
    } catch (error) {
        logger.error(`Error in deleting user account ${error.message}`)
        res.status(500).json({ success: false, message: "Internal Server error" })

    }







}

