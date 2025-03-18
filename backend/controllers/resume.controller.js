import { User } from "../models/user.model.js";
import { Resume } from "../models/resume.model.js";
export const saveResume=async(req,res)=>{
    const { content } = req.body;
    const { userId } = req.params;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
    try {
      const user = await User.findOne({ clerkId: userId });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const resume = await Resume.findOneAndUpdate(
        { userId: user._id },
        { content },
        { new: true, upsert: true }
      );
  
      res.json(resume);
    } catch (error) {
      console.error('Error saving resume:', error);
      res.status(500).json({ error: 'Failed to save resume' });
    }
  };
  export const getResume=async(req,res)=>{
    const { userId } = req.params;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
    try {
      const user = await User.findOne({ clerkId: userId });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const resume = await Resume.findOne({ userId: user._id });
      res.json(resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
      res.status(500).json({ error: 'Failed to fetch resume' });
    }
  }