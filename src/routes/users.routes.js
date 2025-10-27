import {Router} from "express"
import {registerUser} from "../controllers/users.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"
const router =Router();
router.route("/register").post(
    upload.fields([  
        {
            name :"avatar", // frontend field should also be of same name
            maxCount:1
        },
        {
            name:"coverImage", // frontend me ye field ka bhi name same hona chaiye
        maxCount:1        
        }
    ]),
    
    registerUser)

export default router
/*

multer is a nodejs middleware that lets express file handle file uploads
it saves files temporarily on your server before it is moved to any third party file upload system
The upload.fields([...]) middleware runs before your controller (registerUser).

It checks for files in those fields (avatar, coverImage).

It saves them in /public/temp/.

It attaches file info to req.files (so you can access it later).

Then registerUser runs, where you can access:
*/