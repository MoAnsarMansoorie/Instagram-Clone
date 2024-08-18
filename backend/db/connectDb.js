import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully...")
        
    } catch (error) {
        console.log("Database not connected.")
        console.log(error)
    }
}

export default connectDb;


