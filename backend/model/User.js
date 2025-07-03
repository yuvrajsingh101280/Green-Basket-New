import mongoose from "mongoose"


const userSchema = new mongoose.Schema({


    name: {


        type: String, required: true

    },
    email: {

        type: String,
        required: true,
        unique: true,

    },

    password: {

        type: String,

        required: true,
    },
    phone: {

        type: String,
        required: true,
        unique: true,

    },


    profilePic: {
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "user", "super-admin"],
        default: "user"

    },


    isVerified: { type: Boolean, default: false },
    defaultAddressId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"


    },


}, { timestamps: true })


const User = new mongoose.model("User", userSchema)

export default User