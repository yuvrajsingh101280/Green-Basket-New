import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { deleteUserAccount, getUserData, updateUserProfile } from "../controller/userController.js"
const router = express.Router()
// user routes
router.get("/data", protectRoute, getUserData)
router.put("/update-profile", protectRoute, updateUserProfile)
router.delete("/delete-account", protectRoute, deleteUserAccount)

export default router