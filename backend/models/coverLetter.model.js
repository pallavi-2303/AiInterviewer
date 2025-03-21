import mongoose from "mongoose";

const CoverLetterSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CoverLetterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const CoverLetter = mongoose.model('CoverLetter', CoverLetterSchema);
