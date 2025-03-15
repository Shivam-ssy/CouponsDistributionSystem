import { app } from "./src/app.js";
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from "./src/config/db.js";


const port = process.env.PORT || 4000

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is listing at port ${port}`)
    })
}).catch((error)=>{
    console.log(error)
})