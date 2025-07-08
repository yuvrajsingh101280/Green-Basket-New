import User from "../model/User.js"
import bcrypt, { genSalt } from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"

import { sendOTP, verifyOTP } from "../config/twilioClient.js"

import logger from "../utils/logger.js"



export const register = async (req, res) => {


    try {

        const { name, email, password, phone } = req.body
        // validation


        if (!email || !password || !name || !phone) {
            logger.warn("Registration Failed : missing field")
            return res.status(400).json({ success: false, messsage: "All fields are required" })
        }

        // check if the user already exist

        const user = await User.findOne({ email })
        if (user) {
            logger.warn(`Registration failed : Email already exist - ${email}`)
            return res.status(400).json({ success: false, message: "User already exist" })

        }
        // check with phone number also


        const existingUser = await User.findOne({ phone })
        if (existingUser) {
            logger.warn("Registration failed : Phone number already used - ${phone}")
            return res.status(400).json({ success: false, message: "Phone number is already used please use different phone number" })

        }
        // check the valid email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            logger.warn("Invalid email format")
            return res.status(400).json({ success: false, message: "Invalid email" })

        }
        // check the password
        if (password.length < 6) {
            logger.warn("Password Too Short")
            return res.status(400).json({ success: false, message: "Password should have a minimum 6 charater length" })

        }


        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        // random avatar
        const seed = `${name}-${Math.floor(Math.random() * 10000)}`;
        const randomAvatar = `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${encodeURIComponent(seed)}`;

        const newUser = await User.create({ name, email, password: hashedPassword, phone, profilePic: randomAvatar })

        generateTokenAndSetCookie(newUser._id, res)
        logger.info(`User Registered Successfully - ${newUser.email}`)
        res.status(200).json({ success: true, message: "User created but not verified . Please verify with otp", user: { ...newUser._doc, password: undefined } })

    } catch (error) {

        console.log("Error in creating the user ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })



    }



}

export const generateOTP = async (req, res) => {

    try {
        const phone = req.user.phone
        const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`
        const otpResponse = await sendOTP(formattedPhone)

        logger.info(`OTP sent to ${formattedPhone}`);
        res.status(200).json({ success: true, message: "otp send successfully", sid: otpResponse.sid })
    } catch (error) {
        logger.error(`OTP send failed: ${error.message}`);
        return res.status(500).json({ success: false, message: "Failed to send otp" })
    }


}

export const verification = async (req, res) => {

    try {
        const { otp } = req.body
        const phone = req.user.phone
        const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`
        const user = await User.findOne({ phone })
        if (!user) {

            logger.warn(`Verification failed: User not found - ${phone}`);
            return res.status(400).json({ success: false, message: "User not found" })
        }




        const verification = await verifyOTP(formattedPhone, otp)

        if (verification.status !== "approved") {
            logger.warn(`OTP expired or invalid for phone: ${formattedPhone}`);
            return res.status(400).json({ success: false, message: "OTP is expired" })

        }

        user.isVerified = true
        await user.save()
        generateTokenAndSetCookie(user._id, res)
        logger.info(`User verified successfully: ${user.email}`);
        res.status(200).json({
            success: true, message: "Verified successfully", user: {
                ...user._doc, password: undefined

            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Verified unsuccefull" })
    }









}


export const login = async (req, res) => {

    try {
        // login using email and passowrd
        const { email, password } = req.body

        if (!email || !password) {
            logger.warn("Login failed: Missing email or password");
            return res.status(400).json({ success: false, message: "All fields are required" })

        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            logger.error("Invalid email format")
            return res.status(400).json({ success: false, message: "Invalid email" })

        }
        // check the password
        if (password.length < 6) {
            logger.warn("Password Too Short")
            return res.status(400).json({ success: false, message: "Password should have a minimum 6 charater length" })

        }



        const user = await User.findOne({ email })
        if (!user) {

            logger.warn(`Login failed: User not found - ${email}`);
            return res.status(200).json({ success: false, message: "User not found" })

        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            logger.warn(`Login failed: Invalid password for user - ${email}`);
            return res.status(400).json({ success: false, message: "Invalid credentials" });


        }
        if (!user.isVerified) {

            logger.warn(`Login failed: Unverified user - ${email}`);
            return res.status(400).json({ success: false, message: "You are not verifed please verify yourself" })

        }



        generateTokenAndSetCookie(user._id, res)
        logger.info(`User logged in: ${email}`);
        res.status(200).json({
            success: true, message: "User logged in ...............", user: {

                ...user._doc, password: undefined


            }
        })
    } catch (error) {

        logger.error(`Login error: ${error.message}`);
        return res.status(500).json({ success: false, message: "Error in loggin" })

    }


}


export const loginViaOTP = async (req, res) => {
    try {

        const { phone } = req.body
        const formattedNumber = phone.startsWith("+") ? phone : `+${phone}`

        if (!phone) {
            logger.warn("OTP login failed: No phone number provided");
            return res.status(400).json({ success: false, message: "Please Provide the phone  number" })


        }


        // if (!isValidPhoneNumber(phone)) {

        //     return res.status(400).json({ success: false, message: "Please enter a valid phone number" })


        // }
        const user = await User.findOne({ phone })
        if (!user) {
            logger.warn(`OTP login failed: User not found - ${phone}`);
            return res.status(400).json({ success: false, message: "User not found" })

        }
        await sendOTP(formattedNumber)
        logger.info(`OTP sent for login to ${formattedNumber}`);
        res.status(200).json({ success: true, message: "OTP send successfully" })


    } catch (error) {
        logger.error(`OTP login error: ${error.message}`);

        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }






}
export const verifyLoginOTP = async (req, res) => {
    try {
        const { otp, phone } = req.body
        const formattedNumber = phone.startsWith("+") ? phone : `+${phone}`

        const user = await User.findOne({ phone })

        if (!user) {
            logger.warn(`Verify OTP login failed: User not found - ${phone}`);
            return res.status(400).json({ success: false, message: "User not found" })

        }
        if (!otp) {
            logger.warn("OTP not provided for verification");
            return res.status(400).json({ success: false, message: "please provide the otp" })


        }
        const verification = await verifyOTP(formattedNumber, otp)

        if (!verification.status == "approved") {
            logger.warn("OTP expired or invalid during login verification");
            return res.status(400).json({ success: false, message: "opt is expired" })

        }

        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }
        generateTokenAndSetCookie(user._id, res)
        logger.info(`User logged in via OTP: ${phone}`);
        return res.status(200).json({ success: true, message: "Logged in successfull", user: { ...user._doc, password: undefined } })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}
export const logout = async (req, res) => {


    try {
        res.clearCookie("token")
        logger.info(`User logged out`);
        return res.status(200).json({ success: true, message: "Logged out" })

    } catch (error) {

        logger.error(`Logout failed: ${error.message}`);
        return res.status(500).json({ success: false, message: "Logged out unsuccessfull" })

    }
}

// forget password

export const forgetPassword = async (req, res) => {

    try {
        const { phone } = req.body
        const formattedNumber = phone.startsWith("+") ? phone : `+${phone}`
        const user = await User.findOne({ phone })
        if (!user) {


            logger.warn(`Forgot password failed: User not found - ${phone}`);
            res.status(400).json({ succcess: false, message: "User not found" })
        }
        await sendOTP(formattedNumber)
        logger.info(`OTP sent for password reset to ${formattedNumber}`);
        return res.status(200).json({ success: true, message: "A verification otp send successfull" })
    } catch (error) {
        logger.error(`Forgot password error: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}


export const resetPassword = async (req, res) => {

    try {
        const { otp, phone, newPassword } = req.body
        const formattedNumber = phone.startsWith("+") ? phone : `+${phone}`

        // if (!newPassword.length < 6) {

        //     return res.status(400).json({ success: false, message: "Minimum length should be 6 character" })

        // }
        // if (!otp) {

        //     return res.status(400).json({ success: false, message: "Please enter otp" })

        // }



        const user = await User.findOne({ phone })
        if (!user) {

            logger.warn(`Reset password failed: User not found - ${phone}`);

            res.status(400).json({ succcess: false, message: "User not found" })
        }
        const verification = await verifyOTP(formattedNumber, otp)

        if (verification.status !== "approved") {
            logger.warn("OTP verification failed during password reset");
            return res.status(400).json({ success: false, message: "Invalid otp it is expired" })



        }


        if (verification.status === "approved") {


            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)

            user.save()


        }
        logger.info(`Password reset successful for user: ${phone}`);
        return res.status(200).json({ success: true, message: "Password update successfully" })
    } catch (error) {
        logger.error(`Reset password error: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}
