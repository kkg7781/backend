import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const videoSchema=new mongoose.Schema({

videoFile:{
    type :String, // cloudnary url 
    required:true
},
thumbnail:{
    type :String, // cloudnary url 
    required:true
},
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required :true
},
duration :{
    type :Number,
    required:true
},
views:{
    type:Number,
    default:0
},
isPublished :{
    type:Boolean,
    default:true
},
owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
}
},
{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video=mongoose.model("Video", videoSchema)
// additional notes on plugins and pipelines
//videoSchema → a Mongoose schema (for a Video collection)

//.plugin() → Mongoose method to extend schema functionality

//mongooseAggregatePaginate → a plugin that adds pagination methods for aggregation queries

//👉 After this line, your Video model can paginate aggregate() results, not just normal find() queries.