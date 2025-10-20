 // ek higher order function declare kr rhe jo fn as parameter accept kare

const asyncHnadler=(func)=>async(req,res,next)=>{
try {
    await(req,res,next)
} catch (error) {
    res.status(error.code).json({
        sucess : false,
        message :error.message
    })
    
}
}



export default asyncHandler