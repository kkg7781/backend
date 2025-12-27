import {Router} from "express"
import {loginUser, logoutUser, refreshAccessToken, registerUser} from "../controllers/users.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
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

    ///ek login ke liye route
    router.route("/login").post(loginUser)
    // secured routes in routes ka access tbhi milega jb user ke pass access token ho
    router.route("/logout").post(verifyJWT,logoutUser);

    router.route("/refresh-token").post(refreshAccessToken)



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