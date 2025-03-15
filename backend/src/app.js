import express from 'express'
import dotenv from 'dotenv'
import { ApiResponse } from './utils/ApiResponse.js'
import { errorHandler } from './utils/errorHandler.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import couponRouter from "./routes/coupons.route.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials:true
}))

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
  
app.use(globalLimiter);

app.get('/',async (req,res)=>{
    res.json(new ApiResponse(200,null, "Server has been started"))
})


app.use('/api/v1/coupons',couponRouter)
//Handle all the errors
app.use(errorHandler)
export {app}
