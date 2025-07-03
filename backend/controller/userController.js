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