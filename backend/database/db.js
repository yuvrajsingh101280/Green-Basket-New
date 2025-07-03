import mongoose from "mongoose";


const connectToDB = async () => {

    try {


        const MONGO_URI = process.env.MONGO_URL



        await mongoose.connect(MONGO_URI)
        console.log("Database connected successFully")


    } catch (error) {


        console.log("Error in connecting Database", error)

    }



}
export default connectToDB