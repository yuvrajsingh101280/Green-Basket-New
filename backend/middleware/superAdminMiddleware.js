export const superAdminOnly = async (req, res, next) => {



    if (!req.user || req.user.role !== "super-admin") {


        return res.status(403).json({ success: false, message: "Access denied : Super Admins only" })

    }
    next()

}