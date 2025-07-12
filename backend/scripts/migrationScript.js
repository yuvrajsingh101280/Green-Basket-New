import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "../model/Product.js";
dotenv.config()

const migrate = async () => {

    try {
        const products = await Product.find()
        for (const product of products) {
            // Check if fields are missing and set defaults
            if (product.discount === undefined) product.discount = 0;
            if (product.rating === undefined) product.rating = 0;
            if (product.isFeatured === undefined) product.isFeatured = false;
            if (product.tags === undefined) product.tags = [];

            await product.save();
            console.log(`Updated product: ${product.name}`);
        }
        console.log("Migration complete ✅");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed :", err);
        process.exit(1);
    }

}

await mongoose.connect(process.env.MONGO_URL).then(() => { console.log("Database connected"); migrate() }).catch(err => { console.log(err) })