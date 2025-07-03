
import jwt from "jsonwebtoken"
import User from "../model/User.js"
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token


        if (!token) {

            return res.status(400).json({ succes: false, message: "Token is missing" })


        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {

            return res.status(400).json({ success: false, message: "Invalid token unauthorized user" })

        }
        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {

            return res.status(400).json({ success: false, message: "unauthorized  - user not found" })


        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export default protectRoute