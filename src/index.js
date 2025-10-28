//require('dotenv').config({path: './env'}) this line disturbs code consistency as all other are using import statements but here we are using
// require statements
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config(
    {
        path:"./.env" // config ek object leta hai jo batata hai ki env variables konse path me hai like yaaha root ke andar .env me h
    }
)

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on port : ${process.env.PORT}`);
        
    })
})
.catch((error)=>{
    console.log("Mongo DB connection FAiled !!!",error);

});
