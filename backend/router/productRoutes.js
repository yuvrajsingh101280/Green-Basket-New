import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { adminOnly } from "../middleware/adminMiddleware.js"
import { createProduct, deleteProduct, getAllProduct, getProductByCategory, getProductById, toggleProductStatus, updateProduct } from "../controller/productController.js"
import upload from "../config/multer.js"
const router = express.Router()

// admin
router.post("/create-product", protectRoute, adminOnly, upload.array("images", 5), createProduct)
router.put("/update-product/:id", protectRoute, adminOnly, updateProduct)
router.delete("/delete-product/:id", protectRoute, adminOnly, deleteProduct)
router.put("/:id/toggle", protectRoute, adminOnly, toggleProductStatus)



// public routes
router.get("/all-products", getAllProduct)
router.get("/:id", getProductById)
router.get("/category/:categoryId", getProductByCategory)
export default router