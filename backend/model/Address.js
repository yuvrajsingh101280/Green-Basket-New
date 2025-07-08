import mongoose from "mongoose"


const AddressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    label: {
        type: String,
        required: true
    },//office or home


    street: {

        type: String,
        required: true

    },
    city: {

        type: String,
        required: true

    },
    state: {

        type: String,
        required: true


    },

    pincode: {
        type: String,
        required: true

    },
    country: {


        type: String,
        default: "India",
        required: true

    },

    isDefault: {

        type: Boolean, default: true//it tell whether the user address is default or not 

    }





}, { timestamps: true })


const Address = mongoose.model("Address", AddressSchema)

export default Address