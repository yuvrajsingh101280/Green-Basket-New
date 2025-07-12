
import { v2 as cloudinary } from "cloudinary"
import Product from "../model/Product.js"
import logger from "../utils/logger.js"

// 🔧 Helper to calculate final price
const getFinalPrice = (product) => {
    const now = new Date();
    const isDiscountValid = product.discount > 0 &&
        (!product.discountExpiresAt || new Date(product.discountExpiresAt) > now);

    const discount = isDiscountValid ? product.discount : 0;
    const finalPrice = product.price - (product.price * discount / 100);

    return { ...product._doc, finalPrice, isDiscountActive: isDiscountValid };
};

// admin controller
export const createProduct = async (req, res) => {

    try {
        const { name, description, price, category, stock, unit, discount = 0, discountExpiresAt, rating = 0, isFeatured = false, tags = [] } = req.body

        if (!name || !price || !category || !stock || !unit) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        if (discount < 0 || discount > 100) {
            return res.status(400).json({ success: false, message: "Invalid discount value" });
        }
        if (discountExpiresAt && isNaN(Date.parse(discountExpiresAt))) {
            return res.status(400).json({ success: false, message: "Invalid discount expiration date" });
        }

        const images = []


        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                const result = await cloudinary.uploader.upload(file.path, { folder: "products" })
                images.push({ url: result.secure_url, public_id: result.public_id })

            }

        }

        const product = await Product.create({ name, description, price, category, stock, unit, images, discount, discountExpiresAt, rating, isFeatured, tags })
        logger.info(`product created : ${product._id}`)
        return res.status(200).json({ success: true, message: "Product Created", product })
    } catch (error) {
        logger.error(`Error in creating product : ${error.message}`)
        return res.status(500).json("Internal server error")
    }


}

export const updateProduct = async (req, res) => {
    try {

        const productId = req.params.id
        const files = req.files
        const updates = req.body

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not found" })

        }
        // delete the older image
        if (files && files.length > 0) {

            for (const productImage of product.images) {

                await cloudinary.uploader.destroy(productImage.public_id)

            }


            // upload new images
            const newImages = []
            for (const file of files) {

                const result = await cloudinary.uploader.upload(file.path, { folder: "products" })
                newImages.push({ url: result.secure_url, public_id: result.public_id })
            }

            updates.images = newImages
        }
        const updateProduct = await Product.findByIdAndUpdate(productId, updates, { new: true })
        logger.info(`product is updated : ${updateProduct._id}`)
        res.status(200).json({ success: true, message: "Product updated", product: updateProduct })
    } catch (error) {
        logger.error(`Update product error: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const deleteProduct = async (req, res) => {

    try {
        const productId = req.params.id
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(400).json({ success: false, message: "Product not found" })


        }
        // delete the cloudinary images
        for (const image of product.images) {

            await cloudinary.uploader.destroy(image.public_id)

        }

        const deletedProduct = await Product.deleteOne({ _id: productId })
        logger.info(`Product deleted : ${productId}`)
        return res.status(200).json({ success: true, message: "Product deleted" })
    } catch (error) {
        logger.error(`Error in deleting product ${productId}`)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
export const toggleProductStatus = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(400).json({ success: false, message: "Product not found" })

        }
        product.isActive = !product.isActive
        product.save()
        return res.status(200).json({ success: true, product })
    } catch (error) {
        logger.error(`Error in toggling : ${error.message}`)
        return res.status(500).json({ success: false, message: "Internal Server error" })
    }

}


// public controller 
export const getAllProduct = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", minPrice = 0, maxPrice = Number.MAX_SAFE_INTEGER, sort = "latest", tags, isFeatured } = req.query

        const query = {

            isActive: true,
            price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
            $or: [

                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }


            ]

        }

        if (tags) {

            query.tags = { $in: tags.split(",") }

        }
        if (isFeatured === "true") {

            query.isFeatured = true

        }

        const sortOption = {

            latest: { createdAt: -1 },
            lowtohigh: { price: 1 },
            hightolow: { price: -1 },
            rating: { rating: -1 }


        }[sort] || { createdAt: -1 }

        // sorting logice



        const total = await Product.countDocuments(query)

        // fetch the product
        const products = await Product.find(query).populate("category", "name").skip((page - 1) * limit).limit(Number(limit)).sort(sortOption)
        const enriched = products.map(getFinalPrice)
        res.status(200).json({ success: true, total, currentPage: Number(page), totalPages: Math.ceil(total / limit), products: enriched })



    } catch (error) {
        logger.error(`Error in getAllProduct: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "name")
        if (!product || !product.isActive) {

            return res.status(400).json({ success: false, message: "Product not found" })

        }
        const enriched = getFinalPrice(product)
        res.status(200).json({ success: true, product: enriched });
    } catch (error) {
        logger.error(`Error in getProductById: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}
export const getProductByCategory = async (req, res) => {

    try {
        const { categoryId } = req.params
        const { page = 1, limit = 10 } = req.query;
        const query = { category: categoryId, isActive: true };
        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        const enriched = products.map(getFinalPrice)
        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            products: enriched
        })

    } catch (error) {
        logger.error(`Error in getProductByCategory: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}