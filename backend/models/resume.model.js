import mongoose from "mongoose";

// Define the Entry Schema for experience, education, and projects
const entrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

// Define the Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  linkedin: { type: String, required: false },
  github: { type: String, required: false }
});

// Define the Resume Schema
const resumeSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true, unique: true },
  contactInfo: contactSchema,
  summary: { type: String, required: true },
  skills: { type: String, required: true },
  experience: [entrySchema],
  education: [entrySchema],
  projects: [entrySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Resume = mongoose.model("Resume", resumeSchema);
