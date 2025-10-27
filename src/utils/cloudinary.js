import { v2 as cloudinary } from 'cloudinary';
//import { log } from 'console';
import fs from "fs";


 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    })

const cloudinaryUpload= async (localFilePath)=>{
    try {
        if(!localFilePath) // if no file path present return null;
            return null;
            // if file path is present then upload file on cloudinary from our local server
           const fileUpload= await  cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
           // now, since file has been uploaded successfully we can console.log to check results
           // also send the browser with response 
           console.log("File has been sucessfully uploaded on cloudinary ", fileUpload.url);
           response.send(fileUpload.url) // send the url of cloudinary on browser
    } catch (error) {
        // remove the locally saved temporary file since as it didnt got uploaded on cloudinary
        fs.unlinkSync(localFilePath);
        return null;

        
    }

}
export {cloudinaryUpload}

    
   