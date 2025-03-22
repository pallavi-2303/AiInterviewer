import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'
import CoverLetterPreview from './CoverLetterPreview'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const EditCoverLetterPage = () => {
const {id}=useParams();
const {userId}=useAuth();
const [coverLetter,setCoverLetter]=useState(null);
useEffect(()=>{
const getCoverLetterById=async()=>{
try {
 const response=await axios.get(`https://aiinterviewer-87mp.onrender.com/coverLetter/${id}`,{
    headers:{
    'userId':userId
    }
 });
setCoverLetter(response.data);
}
 catch (error) {
    console.error("Error fetching cover letter:", error);  
}}
if (id) {
    getCoverLetterById();
  }
},[id]);
if (!coverLetter) return <div>Loading...</div>;
  return (
    <div className="container mx-auto py-6">
    <div className="flex flex-col space-y-2">
      <Link to="/ai-cover-letter">
        <Button variant="link" className="gap-2 pl-0">
          <ArrowLeft className="h-4 w-4" />
          Back to Cover Letters
        </Button>
      </Link>
      <h1 className="text-6xl font-bold gradient-title mb-6">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
      </div>

      <CoverLetterPreview content={coverLetter?.content} />
    </div>
  )
}

export default EditCoverLetterPage