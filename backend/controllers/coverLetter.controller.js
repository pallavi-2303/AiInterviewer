import { CoverLetter } from "../models/coverLetter.model.js";

// Create a new cover letter
export const createCoverLetter = async (req, res) => {
   
  try {
  const {userId,content,jobTitle,companyName,jobDescription,status}=req.body;
    const coverLetter = new CoverLetter({
     userId,
     content,
     jobTitle,
     companyName,
     jobDescription,
     status:status || 'draft'
    });
    await coverLetter.save();
    res.status(201).json(coverLetter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all cover letters for a user
export const getCoverLetters = async (req, res) => {
  try {
    const {userId}=req.params;
    const coverLetters = await CoverLetter.find(userId);
    res.json(coverLetters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific cover letter by ID
export const getCoverLetterById = async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findById(req.params.id);

    if (!coverLetter || coverLetter.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }
    res.json(coverLetter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a cover letter
export const updateCoverLetter = async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findById(req.params.id);

    if (!coverLetter || coverLetter.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }

    Object.assign(coverLetter, req.body);
    await coverLetter.save();

    res.json(coverLetter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a cover letter
export const deleteCoverLetter = async (req, res) => {
  try {
   const {id}=req.params;
   const userId = req.headers['userid'];  // Get userId from headers
   console.log(id);
    const coverLetter = await CoverLetter.findById(id);
console.log(coverLetter.userId);
console.log(userId)

    if (!coverLetter || coverLetter.userId !== userId) {
      return res.status(404).json({ message: 'Cover letter not found' });
    }
console.log("hii")
    await coverLetter.deleteOne();
    res.json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
