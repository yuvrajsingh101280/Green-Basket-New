import express from "express"
import "dotenv/config"
import connectToDB from "./database/db.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "../backend/router/authRoutes.js"
import connectToClodinary from "./config/cloudinary.js"
import userRoutes from "../backend/router/userRoutes.js"
import axios from "axios"
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
    res.send("Api is live")

})
// for reseting the uptime
const url = "https://green-basket-new.onrender.com"
const interval = 30000


function reloadWebsite() {
    axios
        .get(url)
        .then((res) => {
            console.log("Website reloaded");
        })
        .catch((err) => {
            console.log(`Error : ${err.message}`);
        });
}

setInterval(reloadWebsite, interval);

app.listen(port, () => {

    console.log(`server starting at http://localhost:${port}`)


})
