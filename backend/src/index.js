import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from './app.js';
import cors from 'cors'
dotenv.config({
    path: './env'
})
app.use(cors())
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error:",error);
        throw error
    })
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MONGODB DB CONNECTION FAILED !!!", error);
})