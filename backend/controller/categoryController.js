
import { v2 as cloudinary } from "cloudinary"
import Category from "../model/Category.js"
import logger from "../utils/logger.js"

export const createCategory = async (req, res) => {

    try {
        const { name } = req.body
        const image = req.file

        if (!name || !image) {
            return res.status(400).json({ success: false, message: "Name and icon required" })

        }
        const extCategory = await Category.findOne({ name })
        if (extCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" })
        }
        const upload = await cloudinary.uploader.upload(image.path, { folder: "category" })
        const icon = upload.secure_url

        const newCategory = await Category.create({ name, icon })
        logger.info(`Category created : ${newCategory._id}`)
        return res.status(201).json({ success: true, message: "Category created", category: newCategory })
    } catch (error) {
        logger.info(`Error in creating category : ${error.message}`)
        return res.status(500).json("Internal Server Error")

    }


}
export const deleteCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id)
        if (!category) {
            return res.status(400).json({ success: false, message: "category not found" })

        }
        await category.deleteOne()
        logger.info(`category deleted : ${req.params.id}`)
        return res.status(200).json({ success: true, message: "Catergory deleted successfully" })

    } catch (error) {
        logger.error(`Error in deleting category : ${error.message}`)
        return res.status(500).json({ success: false, message: "Internal Server Error" })

    }

}
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        return res.status(200).json({ success: true, categories })
    } catch (error) {
        logger.error(`Error fetching categories: ${error.message}`);
        res.status(500).json({ success: false, message: "Error fetching categories" });
    }


}