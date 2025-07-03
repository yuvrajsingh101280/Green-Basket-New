import mongoose from "mongoose"
const categorySchema = new mongoose.Schema({


    name: {


        type: String,
        required: true,

    },
    icon: String//veg icon


})
const Category = mongoose.model("Category", categorySchema)
export default Category