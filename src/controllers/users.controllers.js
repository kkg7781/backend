
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { User } from "../models/users.models.js";
import jwt from "jsonwebtoken"
import { upload } from "../middlewares/multer.middlewares.js";

//const asyncHandler={asyncHandler}
const generateAccessAndRefreshToken=async (userId)=>{  
  try {
    const user= await User.findById(userId)
    const accessToken=user.generateAccessToken()   // this method in general is used to generte access and refresh tokens
const refreshToken=user.generateRefreshToken()
//iss point tk access and refresh token generate ho chuka h and after hume refresh token ko database mai bhi save karana hoga 
// so h=that hume baar baar user se nhi maagna pade
user.refreshToken=refreshToken;
await user.save({ValidateBeforeSave :false});


return {accessToken,refreshToken}
    
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    
  }

}

const registerUser=asyncHandler(async(req,res)=>{
   // get user details from frontend (in our case we will use postman to send data)
   // validation - not empty
   //check if user already exists, by looking for username and email(both unique)
   // check for images , check for avatar(its compulsory)
   // upload thme to cloudinary
   // create user object -- create entry in database
   // while sending response, remove password, refresh token 
   // check for user creation
   // return respond
   const {username,email,fullname,password } = req.body;
   //console.log("username :", username);
   console.log("FILES:", req.files);
console.log("BODY:", req.body);


   if([username,email,password].some((field)=>
    field?.trim()===""
   )

   ){
    throw new ApiError(400,"all fields are compulsory")
   }

   // checking if user with specific username or email already exists or not

   const isUserRegistered=await User.findOne({
$or :[{email}, {username}]

   })
   if(isUserRegistered){
    throw new ApiError(409, "A user with this email or username already exists")
   }

// checking for images and avatars
const avatarLocalPath=  req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
  throw new ApiError(400, "avatar field is required")  // // since in data modelling we have given avatar field as reuired:true

}
// now, upload files from our server to cloudinary
const avatar= await cloudinaryUpload(avatarLocalPath)
const coverImage=await cloudinaryUpload(coverImageLocalPath)


if(!avatar){
  throw new ApiError(400, "avatar field is required")
  }  // since in data modelling we have given avatar field as required:true

 const user= await User.create({

    fullname,
    email,
   username : username.toLowerCase(),
   avatar:avatar.url,  // since in we know that that avatar sure shot exists as we have added checks for it before , no need of optional chaining
   coverImage:coverImage?.url || "", // optional cahining essential as cover image can be null which may lead to errors
   password

  })
  // check if user is created or not successfully, we can do one more database call for this not optimal but still very much needed
  const createdUser=await User.findById(user._id).select (
    "-password -refreshToken"
  )
  
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )


})

const loginUser=asyncHandler(async(req,res)=>{
//steps req.body->data
//username or email
//find the user
// password check
//access and refresh token
//send cookie

const {email,username,password}=req.body;
if(!(username || email)){
  throw new ApiError(401, "Please enter username or email");
}
const user= await User.findOne({
  $or :[{username}, {email}]
})
if(!user){
  throw new ApiError(404, "User credentials not found");
}
const isPasswordCorrect= await user.isPasswordCorrect(password);
if(!isPasswordCorrect){
  throw new ApiError(400, "password doesnt match")
}

const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options={
      httpOnly:true,  //this ensures that the refresh token which i will send cannot be modified from frontend or client side

      secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    json(
      new ApiResponse(
        200,
        {
          loggedInUser,accessToken,refreshToken   //ye isliye de rhe cause just in case user wants ki mai khud local storage
          // mai set kare access and refresh token ko latthough not a very good practice but still its his choice!
        },
        "User logged in successfully"
      )
    )



})

const logoutUser=asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(
  req.user._id,{
  $set:{
    refreshToken:undefined,
  }
  },
{
  new:true,  //By default, findOneAndUpdate() returns the document as it was before update was applied. 
    // If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
}
)
const options={
httpOnly:true,
secure:true,
}
 return res.status(200)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken",options)
 .json(
  "User logged out successfully"
 )

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
const incomingRefreshToken=req.cookie?.refreshToken || req.body
if(!incomingRefreshToken){
  throw new ApiError(401, "Unauthorised access")
}
try {
  const decodedToken=jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  
  const user =await User.findById(decodedToken._id)
  if(!user){
    throw new ApiError(401, "Invalid refresh Token")
  }

  if(incomingRefreshToken!=user.refreshToken){
    throw new ApiError(401, "Refresh token is expired")
  }
  const options={
    httpOnly:true,
    secure:true
  }
  const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
  res.
  status(200)
  .cookie("accessToken", accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    json(
      new ApiResponse(
        200,
      {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
      )
    )



  
} catch (error) {
  throw new ApiError(401, error?.message || "Invalid refresh token")
}

})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
const {oldPaswword, newPassword}=req.body

const id=req.user?._id
const user=await User.findById(id)

const isOldPasswordCorrect= await user.isPasswordCorrect(oldPaswword)
if(!isOldPasswordCorrect){
  throw new ApiError(401, "Old password is not valid")
}
user.password=newPassword
await user.save({ValidateBeforeSave:false})
return res
.status(200)
.json(new ApiResponse(200, {}, "password changed successfully"))



})

const getCurrentUser=asyncHandler(async(req,res)=>{
  return res
  .staus(200)
  .json(200, req.user, "current User fetched successfully")
})

const updateAccountDeatils=asyncHandler(async(req,res)=>{
  const{fullname,email}= req.body
  if(!fullname || !email){
    throw new ApiError(400, "username or email is not present")
  }
  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
$set :{
  fullname:fullname,
  email:email

}
    },
    {
      new:true,
       runValidators: true
    }
  ).select("-password-refreshToken")

  return res
  .status(200)
  .json(new ApiResponse(200,user, "User account details updated successfully"))



})

const updateUserAvatar=asyncHandler(async(req,res)=>{

const avatarLocalPath=  req.file?.path
if(!avatarLocalPath){
  throw new ApiError(401, "avatar local path is missing")
}

const avatar=await cloudinaryUpload(avatarLocalPath)
if(!avatar.url){
  throw new ApiError(401, "Error while uploading avatar local path on cloudinary")

}
const user=User.findByIdAndUpdate(
  req.user._id,
  {
$set:{
  avatar:avatar.url
}
  },
  {
    new:true
  }
).select("-password -refreshToken")

return res
.status(200)
.json(200, user, "Avatar image uploaded successfully")

})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
const coverImageLocalPath=req.file?.path
if(!coverImageLocalPath){
  throw new ApiError(400, "Cover Image local path is missing")
}
const coverImage= await cloudinaryUpload(coverImageLocalPath)
if(!coverImage){
  throw new ApiError(400, "error while uploading cover image localpath on cloudinary")
}
const user= await User.findByIdAndUpdate(
  req.user?._id,
  {
    $set:{
      coverImage:coverImage
    }
  },
  {
    new:true
  }

).select("-password -refreshToken")
return res
.status(200)
.json(200, user, "Cover Image uploaded successfully")

})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDeatils,
    updateUserAvatar,
    updateUserCoverImage


}
/*6️⃣ Correct mental model (use this forever)
🔹 Model vs Document
User      → collection level (STATIC)
user      → document level (INSTANCE)

🔹 Who does what?
Operation	Use
Find user	User.findOne()
Create user	User.create()
Check password	user.isPasswordCorrect()
Access fields	user.email
/*









/*

array.some() method checks whether at least one element satisfies the condition provided in the callback function 
If any element satisfies the condition → .some() returns true.
If none do → it returns false.
instead of using.some we can also use array .map to achieve the same functionality

.map() creates a new array by applying a function to every element.

So, to replicate the same functionality, you can use .map() + .includes() like this:

const fields = [username, email, password];

const trimmedFields = fields.map((field) => field?.trim()); // creates new array

if (trimmedFields.includes("")) {
  throw new ApiError(400, "All fields are compulsory");
}

*/