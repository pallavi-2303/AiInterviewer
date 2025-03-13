import { User } from "../models/user.model.js";

export const saveUser=async(req,res)=>{
    try {
  const {id,firstName,lastName,fullName,emailAddresses,imageUrl} =req.body;
 let user=await User.findOne({clerkId:id});
 if(!user)  {
  user=new User({
    clerkId:id,
    firstName,
    lastName,
    fullName,
    email:emailAddresses[0],
    imageUrl
  }) 
  await user.save();
 }
 res.status(200).json({
    success:true,
    message:"User saved Succesfully",
    user
 })
    } catch (error) {
     console.log(error);
     res.status(500).json({success:false ,
        message:"Error while saving the message",
        error:error.message,
     }) 
    }
}