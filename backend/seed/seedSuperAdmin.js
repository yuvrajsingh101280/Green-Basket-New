import connectToDB from "../database/db.js"
import User from "../model/User.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()

const seedSuperAdmin = async () => {

    try {
        await connectToDB()

        const existing = await User.findOne({ email: "superadmin@greenbasket.com" })
        if (existing) {

            console.log("Super admin already exists")
            return process.exit(0)

        }
        const hashedPassword = await bcrypt.hash("SuperAdmin123@", 10)

        await User.create({

            name: "Super Admin",
            email: "superadmin@greenbasket.com",
            password: hashedPassword,
            phone: "+919153347156",
            role: "super-admin",
            isVerified: true




        })
        console.log("Super Admin created succeffully")
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }



}
seedSuperAdmin()