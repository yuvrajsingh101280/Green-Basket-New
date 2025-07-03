import mongoose, { mongo } from "mongoose";
const bannerSchema = new mongoose.Schema({



    image: String,
    title: String,
    linkTo: String//e.g., product/cateory


})
const Banner = mongoose.model("Banner", bannerSchema)
export default Banner