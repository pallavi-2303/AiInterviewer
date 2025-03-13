import { UserAnswer } from "../models/userAnswer.model.js";

export const saveUserAnswer = async (req, res) => {
    try {
  const {
    mockIdRef,
    question,
    correct_ans,
    user_ans,
    feedback,
    rating,
    userId,
  } = req.body; 
  console.log(req.body);
if(!mockIdRef || !userId || !question){
 return res.status(400).json({
    message:"Missing required fields",
 }) 
}
//checking if the answer already exist for this user and this question
const existingAnswer=await UserAnswer.findOne({userId,question});
if(existingAnswer){
  return res.status(409).json({
  message:"You Have Already answered for this question."  
  })
}
const newUserAnswer=new UserAnswer({
    mockIdRef,
    question,
    correct_ans,
    user_ans,
    feedback,
    rating,
    userId,
})
await newUserAnswer.save();
res.status(201).json({ message: "Answer saved successfully", newUserAnswer });
    }
catch (error) {
  console.log("Error while saving the interview",error) ;

 } 
}
export const giveFeedBacks=async(req,res)=>{
    try {
  const {userId,interviewId} =req.params ;
 const feedbacks=await UserAnswer.find({userId,mockIdRef:interviewId}) ;
 return res.status(200).json(feedbacks); 
    } catch (error) {
    console.log("Error",error) ;
    return res.status(400).json({
        message:"Error Occured on Server Side"
    })  
    }
}

