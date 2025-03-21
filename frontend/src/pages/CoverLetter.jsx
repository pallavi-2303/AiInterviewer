import { Button } from '@/components/ui/button'
import CoverLetterList from '@/components/ui/CoverLetterList'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const CoverLetter = () => {
const [coverLetters,setCoverLetters]=useState();
useEffect(()=>{
const fetchCoverLetter=async()=>{
 try {
    const response=await axios.get(`http://localhost:8000/coverLetter/get`);
console.log(response);
setCoverLetters(response.data);
 } catch (error) {
 console.log("Error Fetching cover Letter");
 toast.error("Error Fetching Cover Letter");
 }
}
fetchCoverLetter();
},[])
  return (
    <div><div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
    <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
    <Link to="/ai-cover-letter/new">
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create New
      </Button>
    </Link>
  </div>

  <CoverLetterList coverLetters={coverLetters} /></div>
  )
}

export default CoverLetter