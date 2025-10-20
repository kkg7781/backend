import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtokenk"
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
        type:mongoose.Schema.ObjectId,
        ref: "Video",
    }
],
password:{
    type:String,
    required:[true, "Paswoord is required"]
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

    this.password=bcrypt.hash(this.password, 10);
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
            fullName: this.fullName
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