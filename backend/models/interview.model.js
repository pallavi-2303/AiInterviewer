import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  position: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, minlength: 10 },
  experience: { type: Number, required: true, min: 0 },
  userId: { type:String, ref: "User", required: true },
  techStack: { type: String, required: true },
  questions: [{ question: String, answer: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const Interview=mongoose.model("Interview",InterviewSchema);