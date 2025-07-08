import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { adminGetAllUsers, adminToggleUserStatus, deleteUser } from "../controller/adminController.js"
import { adminOnly } from "../middleware/adminMiddleware.js"
const router = express.Router()

router.get("/all-users", protectRoute, adminOnly, adminGetAllUsers)
router.put("/toggle-user", protectRoute, adminOnly, adminToggleUserStatus)
router.delete("/delete-user/:userId", protectRoute, adminOnly, deleteUser)
export default router