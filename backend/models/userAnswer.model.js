import mongoose from "mongoose";
const UserAnswerSchema=mongoose.Schema({
 mockIdRef:{
    type:String,
    ref:"Interview",
    required:true,
 } ,
 question:{
    type:String,
    required:true,
 }  ,
 correct_ans:{
    type:String,
    required:true,
 },
 user_ans:{
    type:String,
    required:true,
 },
 feedback:{
    type:String,
    required:true,
 },
 rating:{
    type:String,
    required:true,
 },
 userId:{
    type:String,
    required:true,
 },
 createdAt:{
    type:Date,
default:Date.now
 }
})
export const UserAnswer=mongoose.model("UserAnswer",UserAnswerSchema);