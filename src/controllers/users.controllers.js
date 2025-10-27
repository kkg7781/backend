
import { ApiError } from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
//onst asyncHandler={asyncHandler}

const registerUser=asyncHandler((req,res)=>{
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