import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { adminOnly } from "../middleware/adminMiddleware.js"
import { createCategory, deleteCategory, getAllCategories } from "../controller/categoryController.js"
import upload from "../config/multer.js"
const router = express.Router()
// admin
router.post("/create-category", protectRoute, adminOnly, upload.single("image"), createCategory)
router.delete("/delete-category/:id", protectRoute, adminOnly, deleteCategory)


// public
router.get("/getallcategories", getAllCategories)
export default router