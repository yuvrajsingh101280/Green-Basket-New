export const adminOnly = async (req, res, next) => {

    if (!req.user || (req.user.role !== "admin" && req.user.role != "super-admin")) {

        return res.status(403).json({ success: false, message: "Access denied: Admin Only" })


    }
    next()


}