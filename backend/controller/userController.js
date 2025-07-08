
import User from "../model/User.js"
import logger from "../utils/logger.js"
import { v2 as cloudinary } from "cloudinary"
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
        const { name, phone } = req.body
        const updatedUser = await User.findByIdAndUpdate(userId, { name, phone }, { new: true }).select("-password")

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
// update user profile picture

export const updateProfilePicture = async (req, res) => {

    try {

        const userId = req.user._id
        const image = req.file


        if (!image) {
            logger.warn("No image uploaded for profile picture update");
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }
        const user = await User.findById(userId)

        if (!user) {
            logger.warn("User not found during profile update");
            return res.status(400).json({ success: false, message: "User not found" })

        }


        const upload = await cloudinary.uploader.upload(image.path)

        const profilePic = upload.secure_url

        await User.findByIdAndUpdate(userId, { profilePic }, { new: true })

        logger.info(`Profile photo updated for user ID: ${userId}`);
        res.status(200).json({ success: true, message: "Profile photo update" })
    } catch (error) {
        logger.error(`Profile picture update failed: ${error.message}`);
        return res.json({ success: false, message: "Profile photo not updated" })
    }

}
