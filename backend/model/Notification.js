import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({

    userId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    message: String,






}, { timestamps: true })
const Notification = mongoose.model("Notification", notificationSchema)
export default Notification