import mongoose from "mongoose";
const contactFormSchema = new mongoose.Schema({

    name: String,
    email: String,
    subject: String,
    message: String,



}, { timestamps: true })
const ContactForm = mongoose.model("ContactForm", contactFormSchema)
export default ContactForm