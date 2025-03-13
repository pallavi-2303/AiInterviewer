import mongoose from "mongoose";
import { Interview } from "../models/interview.model.js";

export const createInterview=async(req,res)=>{
 try {
  let {userId,position,description,experience,techStack,questions}=req.body;
  
const interview=new Interview({
   position,
   description,
   experience,
   userId, // now in correct ObjectId format
   techStack,
   questions,  
})
  await interview.save();
  res.status(201).json({
    success:true,
message:"Interview created Successfully",
    interview});
 } catch (error) {
   console.log(error);
    res.status(400).json({ error: error.message });
 }   
}
export const getAllInterviews=async(req,res)=>{
  try {
   const {userId} =req.params;
   const interviews=await Interview.find({userId});
  return res.status(200).json({
    message:"All Interviews are Fetched",
    interviews,
  }) 
  } catch (error) {
    res.status(500).json({
      message:"Error while fetching interview",
      error
    })
  }
}
export const getInterviewById=async(req,res)=>{
  try {
 const {interviewId} =req.params; 
 if(!interviewId){
  return res.status(404).json({
    message:"Interview Id is Required"
  })
 }
 const interview=await Interview.findById(interviewId);
 if(!interview){
  return res.status(404).json({
    message:"Interview Not Found."
  })
 }
 return res.status(200).json({
  success:true,
  interview
 })
  } catch (error) {
  console.log("Error while giving the interview",error) ; 
  res.status(500).json({
    message:"Server Error",
    error:error.message
  })
  }
}
export const UpdateById=async(req,res)=>{
  try{
const {id}=req.params;
const data=req.body;
if(!id){
  return res.status(400).json({ message: "Invalid interview ID" });
}
const updatedInterview=await Interview.findByIdAndUpdate(id,{
  questions:data.questions,
  ...data,
  updatedAt:new Date(),
},{new:true})
if (!updatedInterview) {
  return res.status(404).json({ message: "Interview not found" });
}
res.status(200).json(updatedInterview);
}
catch(error){
  res.status(500).json({ message: "Failed to update interview" });

}

}