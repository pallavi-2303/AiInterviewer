import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/scripts'
import { useAuth, useUser } from '@clerk/clerk-react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, Sparkle, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'



const AiCoverLetterPage = () => {
const {user}=useUser();
const {userId}=useAuth();
const navigate=useNavigate();
console.log(userId);
 const coverLetterSchema = z.object({
        companyName: z.string().min(1, "Company name is required"),
        jobTitle: z.string().min(1, "Job title is required"),
        jobDescription: z.string().min(1, "Job description is required"),
      });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm({
        resolver: zodResolver(coverLetterSchema),
      });
    
     /* const {
        loading: generating,
        fn: generateLetterFn,
        data: generatedLetter,
      } = useFetch(generateCoverLetter);*/
      const [generatedLetter, setGeneratedLetter] = useState('');
      const [generating, setGenerating] = useState(false);
        
const generateCoverLetter=async(data)=>{
    setGenerating(true);
    console.log(data);
    const prompt = `
    Write a professional cover letter for a ${data?.jobTitle} position at ${
    data?.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;
  try {
   const result =await chatSession.sendMessage(prompt);
   const response=result.response;
   const Content=response.text().trim();
   return Content;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  } finally{
    setGenerating(false);
  }
}     
const onSubmit = async (data) => {
    try {
   const content=   await generateCoverLetter(data);
   // Step 2: Save the cover letter to the database
   const saveResponse = await axios.post('https://aiinterviewer-87mp.onrender.com/coverLetter/create', {
    userId: userId, // Replace with the actual user ID from your auth system
    content,
    jobTitle: data?.jobTitle,
    companyName: data?.companyName,
    jobDescription: data?.jobDescription,
    status: 'completed',
  });
  if (saveResponse.status === 201) {
    toast.success('Cover Letter Saved Successfully!');
    navigate('/cover-letter');  // Redirect to cover letter list page
  }
    } catch (error) {
    console.log(error);
        toast.error("Failed to save cover letter.");
    }
  }; 
  return (
    <div className='space-y-6'>
         <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Provide information about the position you're applying for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields remain the same */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Enter job title"
                  {...register("jobTitle")}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here"
                className="h-32"
                {...register("jobDescription")}
              />
               {errors.jobDescription && (
                <p className="text-sm text-red-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={generating}> <Sparkles/>
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AiCoverLetterPage