import { User } from "../models/users.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";

const verifyJWT=asyncHandler(async(req,res,next)=>{
try {
const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
if(!token){
    throw new ApiError(404, "invalid authentication");
}
const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET )
const user=await User.findById(decodedToken?._id).select("-RefreshToken -password")
if(!user){
    throw new ApiError(400, "Invalid Access Token")
}
req.user=user;
next();

 
} catch (error) {
    
    throw new ApiError(401, error?.message || "Invalid Access Token")
}

})
export {
    verifyJWT,
}