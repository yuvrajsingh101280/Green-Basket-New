import express from "express"
import "dotenv/config"
import connectToDB from "./database/db.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "../backend/router/authRoutes.js"
import connectToClodinary from "./config/cloudinary.js"
import userRoutes from "../backend/router/userRoutes.js"
import axios from "axios"
import addressRoutes from "../backend/router/AddressRoutes.js"
import adminRoutes from "../backend/router/adminRoutes.js"
import superAdmin from "../backend/router/superAdminRouter.js"
import productRoute from "../backend/router/productRoutes.js"
import categoryRotue from "../backend/router/categoryRoutes.js"
import cartRouter from "../backend/router/cartRoutes.js"
import orderRotuer from "../backend/router/orderRoutes.js"
import webhookRouter from "../backend/router/webhookRoutes.js"
import reviewRoutes from "../backend/router/reviewRoutes.js"
import wishlistRoutes from "../backend/router/wishlistRoutes.js"
import couponRotues from "../backend/router/couponRoutes.js"
// app instance
const app = express()
// port
const port = process.env.PORT

// connect to database

await connectToDB()
await connectToClodinary()
// razorpay-webhook
app.use("/webhook", webhookRouter)
// middleware
app.use(express.json())
const allowedOrigins = [
    "http://localhost:5173",
    "https://green-basket-new-hncq.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(cookieParser())
// routers

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/address", addressRoutes)
app.use("/api/admin-routes", adminRoutes)
app.use("/api/super-admin", superAdmin)
app.use("/api/product", productRoute)
app.use("/api/category", categoryRotue)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRotuer)
app.use("/api/reviews", reviewRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/coupon", couponRotues)
app.get("/", (req, res) => {
    res.send("Api is live")

})
// for reseting the uptime
const url = "https://green-basket-new.onrender.com"
const interval = 60000


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
