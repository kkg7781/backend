import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
const app=express();
app.use(cors({
    origin :process.env.ORIGIN,
    credentials :true
}))
app.use(express.json({limit :"12kb"}))  // for json files
app.use(express.urlencoded({extended :true,
    limit :"12kb"
})) // for accepting url type of data and extended allows nesting in objects
app.use(express.static("public")) // helps to diaplay stattic files like images etc which is as mentioned here in public folder
app.use(cookieParser())      // cookie parser help krta hai user cookis mai crud applications perform krne mai
export default app;
