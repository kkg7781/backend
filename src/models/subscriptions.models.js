import mongoose from "mongoose";
const subscriptionSchema=new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    subscribedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
{timestamps:true})
export const Subscription=mongoose.model("Subscription", subscriptionSchema)

// subscriptionSchema → a Mongoose schema (for a Subscription collection)
// .timestamps:true → Mongoose option to auto-add createdAt and updatedAt fields
// subscriber → the user who is subscribing
// subscribedTo → the user being subscribed to
// Both fields are ObjectIds referencing User documents
// export const Subscription → exports the Subscription model for use elsewhere

