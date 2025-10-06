import mongoose from "mongoose";
import { DB_NAME } from "../constants";

// appraoch db folder mai database connect ka code likh do and usko at the end index.js mai export krdo jisse code thora clean lage
// since, database can be in another continent better always use async await

const connectDB= async ()=>{
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`MONGO DB connected !! DB host :${connectionInstance.connection.host}`);
       
        
    } catch (error) {
        console.error("An error occured ", error.message );
        process.exit(1);

        
    }
}

export default connectDB