import mongoose from "mongoose"

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGO DB connected! ${conn.connection.host}`);
    } catch (error) {
        console.log("Mongo DB connection error: ", error);
    }
};