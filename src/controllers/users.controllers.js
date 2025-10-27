
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
//onst asyncHandler={asyncHandler}

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
   console.log("username :", username);
   if([username,email,password].some((field)=>
    field?.trim()===""
   )

   ){
    throw new ApiError(400,"all fields are compulsory")
   }

   // checking if user with specific username or email already exists or not

   const isUserRegistered=User.findOne({
$or :[{email}, {username}]

   })
   if(isUserRegistered){
    throw new ApiError(409, "A user with this email or username already exists")
   }

// checking for images and avatars
const avatarLocalPath=  req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.avatar[0]?.path;

if(!avatarLocalPath){
  throw new ApiError(400, "avatar field is required")  // // since in data modelling we have given avatar field as reuired:true

}
// now, upload files from our server to cloudinary
const avatar= await cloudinaryUpload(avatarLocalPath)
const coverImage=await cloudinaryUpload(coverImageLocalPath)


if(!avatar){
  throw new ApiError(400, "avatar field is required")
  }  // since in data modelling we have given avatar field as required:true

  User.create({

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

export {
    registerUser,
}





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