import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { format, parse } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog'
import { Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
 
const CoverLetterList = ({initialcoverLetters}) => {
  const {userId}=useAuth();
  const navigate=useNavigate();
  const [coverLetters,setCoverLetters]=useState(initialcoverLetters);
  useEffect(()=>{
setCoverLetters(initialcoverLetters);
  },[initialcoverLetters])
const handleDelete=async(id)=>{
  console.log(id);
  try {
   await axios.delete(`https://aiinterviewer-87mp.onrender.com/coverLetter/${id}`,{
    headers:{
      'userId':userId
    }
   });
   toast.success("Cover Letter Deleted Successfully");
   setCoverLetters(prevCoverLetters=>prevCoverLetters.filter(letter=>letter._id!==id));
  } catch (error) {
    console.log(error);
   console.log(error.message);
   toast.error("Failed to delete cover Letter");
  }  
}
if(!coverLetters?.length){
    return (
        <Card>
          <CardHeader>
            <CardTitle>No Cover Letters Yet</CardTitle>
            <CardDescription>
              Create your first cover letter to get started
            </CardDescription>
          </CardHeader>
        </Card>
      );
}
  return (
    <div className="space-y-4">
    {coverLetters?.map((letter) => (
      <Card key={letter?.id} className="group relative ">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl gradient-title">
                {letter.jobTitle} at {letter.companyName}
              </CardTitle>
              <CardDescription>
                Created {format(new Date(letter.createdAt), "PPP")}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <AlertDialog>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/ai-cover-letter/${letter._id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your cover letter for {letter.jobTitle} at{" "}
                        {letter.companyName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(letter._id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm line-clamp-3">
              {letter.jobDescription}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default CoverLetterList