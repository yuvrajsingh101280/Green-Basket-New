import express from "express"
import "dotenv/config"
import connectToDB from "./database/db.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "../backend/router/authRoutes.js"
import connectToClodinary from "./config/cloudinary.js"
import userRoutes from "../backend/router/userRoutes.js"
const app = express()
const port = process.env.PORT

// connect to database

await connectToDB()
await connectToClodinary()
// middleware
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true // Important for cookies, if you're using them
}));
app.use(cookieParser())
// routers

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)





app.get("/", (req, res) => {
    res.send("Hello world")

})


app.listen(port, () => {

    console.log(`server starting at http://localhost:${port}`)


})
