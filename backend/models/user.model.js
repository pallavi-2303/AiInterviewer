import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
 clerkId:{type:String,required:true,unique:true},
 firstName:{type:String,required:true},
 lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String },
  bio: { type: String },
  experience: { type: Number },
  skills: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})
export const User=mongoose.model("User",userSchema);