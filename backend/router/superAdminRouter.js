import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { superAdminOnly } from "../middleware/superAdminMiddleware.js"
import { createAdmin, deleteAdmin } from "../controller/superAdminController.js"
const router = express.Router()
router.post("/create-admin", protectRoute, superAdminOnly, createAdmin)
router.delete("/delete-admin/:adminId", protectRoute, superAdminOnly, deleteAdmin)

export default router