import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { deleteUserAccount, getUserData, updateProfilePicture, updateUserProfile } from "../controller/userController.js"
import upload from "../config/multer.js"
const router = express.Router()
// user routes
router.get("/data", protectRoute, getUserData)
router.put("/update-profile", protectRoute, updateUserProfile)
router.delete("/delete-account", protectRoute, deleteUserAccount)
router.post("/update-profile-pic", protectRoute, upload.single("image"), updateProfilePicture)

export default router