import {asyncHandler} from "../utils/asyncHandler.js";
//onst asyncHandler={asyncHandler}

const registerUser=asyncHandler((req,res)=>{
    res.status(200).json({message : "ok"})
})

export default registerUser