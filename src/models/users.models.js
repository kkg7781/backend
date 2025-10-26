import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=  new mongoose.Schema(
    {
username:{
    type: String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index :true  // helps in searching 
},
 email:{
    type:String,
    required:true,
    unique :true,
    lowercase:true,
    trim:true
 },
 fullname :{
    type:String,
    required:true,
    lowercase:true,
    trim:true,

 },
 avatar :{
    type:String,   // cloudnary ka url paste krenge so type string hi rhega
    required:true

 },
 coverImage:{
     type:String,   // cloudnary ka url paste krenge so type string hi rhega
},
watchHistory:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }
],
password:{
    type:String,
    required:[true, "Pasword is required"]
},
refreshToken:{
    type:String
}
    },
{timestamps :true})
userSchema.pre("save", async function (next){    //pre ek middleware hai jo kisis kaam ke hone se mpehle kuch krta hai like
    // yaha save me click krne se pehle ye ek callback function ko execute kr dega yaha pe arrow function isliye nhi use kiye beacuse 
    // haume this keyword ka help chaiye tha aur arrpow function me this keyword global object ko batata hai
    if(!this.isModified("password")) return next();  //if (!this.isModified("password")) return next();

//This line checks if the password field was modified or newly set.
//If you update some other field (like name or email) but not password, you don’t want to hash it again.
////.isModified("password") returns true only if password is newly set or changed.
//If it’s not modified, we skip hashing and move on using next().

    this.password=await bcrypt.hash(this.password, 10);
    next();

}) /// async → allows us to use await inside (needed because bcrypt.hash() is asynchronous).
userSchema.methods.isPasswordCorrect=async function(password){
return await bcrypt.compare(password,this.password) //returns a boolean
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
         {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User", userSchema) 
/* additional notes
bcrypt :- library for hashing password. it uses an adaptive hashing algo 
jwt:- used to create and verify json web tokens  for stateless authorisation 
Optionally stores the refresh token string for session management.
Storing refresh tokens server-side enables revocation; storing them in DB is common.
.pre(save) middleware runs before user.save even before user.create
make sure to use normal function syntax when passing it as callback function so that we can use this keyword 
this.isModified(password ) returns true if password field has been changed or newly set. 
if pasword is not updated eg:- full name is updated so we dont rehash password. avoids hashing of already hashed functions
bcrypt.hash(this.password, 10)  10 is the salt round the more the value the slower it becomes but security increases 
jwt.sign helps to create a jwt token signed wih ACCESS_TOKEN_SECRET
payloads are passed here and they are thenb further converted to jwt tokens
Refresh tokens usually live longer — days to months (e.g., "7d", "30d").

Server can store refresh tokens to enable revocation (storing in DB).
file upload logic hm log pehle through multer apne system mai temporarily file store rakhenge 
fhir usko cloudinary mai store krwa denge . this will help us to alteast have access of desired file in ase any thing happens

 */ 