
import { v2 as cloudinary } from "cloudinary"
import Product from "../model/Product.js"
import logger from "../utils/logger.js"
// admin controller
export const createProduct = async (req, res) => {

    try {
        const { name, description, price, category, stock, unit } = req.body

        if (!name || !price || !category || !stock || !unit) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const images = []


        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                const result = await cloudinary.uploader.upload(file.path, { folder: "products" })
                images.push({ url: result.secure_url, public_id: result.public_id })

            }

        }

        const product = await Product.create({ name, description, price, category, stock, unit, images })
        logger.info(`product created : ${product._id}`)
        return res.status(200).json({ success: true, message: "Product Created", product })
    } catch (error) {
        logger.error(`Error in creating product : ${error.message}`)
        return res.status(500).json("Internal server error")
    }


}

export const updateProduct = async (req, res) => {


}
export const deleteProduct = async (req, res) => {


}
export const toggleProductStatus = async (req, res) => {


}


// public controller 
export const getAllProduct = async (req, res) => {



}
export const getProductById = async (req, res) => {


}
export const getProductByCategory = async (req, res) => {



}