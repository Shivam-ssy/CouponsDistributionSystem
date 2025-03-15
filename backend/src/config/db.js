import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () =>{
    try {
        const res = await mongoose.connect(process.env.DB_URL)
        if (res) {
            console.log("Database connected successfully")
        }
        
    } catch (error) {
        console.log("Databse connection error",error)
    }
}