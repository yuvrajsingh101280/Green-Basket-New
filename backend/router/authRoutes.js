import express from "express"
import { forgetPassword, generateOTP, login, loginViaOTP, logout, register, resetPassword, updateProfilePicture, verification, verifyLoginOTP } from "../controller/authController.js"
import protectRoute from "../middleware/protectRoute.js"
import upload from "../config/multer.js"
const router = express.Router()
// register routes
router.post("/register", register)
router.post("/generateOtp", protectRoute, generateOTP)
router.post("/verify-otp", protectRoute, verification)
router.post("/update-profilePicture", protectRoute, upload.single("image"), updateProfilePicture)

// login routes
router.post("/login", login)
router.post("/otp-login", loginViaOTP)
router.post("/verify-login-otp", verifyLoginOTP)
router.post("/logout", protectRoute, logout)


// forget-password


router.post("/foget-password", forgetPassword)
router.post("/reset-password", resetPassword)


export default router