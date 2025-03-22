import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingPage from './LoadingPage';
import axios from 'axios';
import CustomBreadCrumb from '@/components/ui/CustomBreadCrumb';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Webcam from 'react-webcam';
import { Lightbulb } from 'lucide-react';
import QuestionsForm from '@/components/ui/QuestionsForm';
const MockInterviewPage = () => {
const {interviewId}=useParams();
const [interview,setInterview]=useState();
const [loading,setLoading]=useState(false);
    const [isWebCamEnabled,setWebCamEnabled]=useState(false);
    const navigate=useNavigate();
    if(!interviewId) navigate("/generate",{replace:true});
    if(!interview) navigate("/generate",{replace:true});
    useEffect(()=>{
        const fetchInterviewById=async()=>{
          if(interviewId){
            try {
        const response=await axios.get(`https://aiinterviewer-87mp.onrender.com/interview/interviewById/${interviewId}`)
        console.log(response);    
setInterview(response.data.interview)  
    } catch (error) {
            console.log(error); 
            }
          }
        }
        fetchInterviewById();
        },[interviewId]);
   if(loading){
     return <LoadingPage/>}
  return (
    <div className='flex flex-col w-full gap-8 py-5'>
        <CustomBreadCrumb
        breadCrumbPage={"Start"}
        breadCrumpItems={[
            {label :"Mock Interviews",link:"/generate"},
            {label :interview?.position || "",link:`/generate/interview/${interview?._id}`}
        ]}
        />
        <div className='w-full'>
        <Alert className="bg-sky-100 border-sky-700 p-4 rounded-lg flex items-start gap-3 -mt-3">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        <div>
          <AlertTitle className="text-sky-800 font-semibold">
            Important Information
          </AlertTitle>
          <AlertDescription className="text-sm text-sky-700 mt-1">
            Please enable your webcam and microphone to start the AI-generated
            mock interview. The interview consists of five questions. You’ll
            receive a personalized report based on your responses at the end.{" "}
            <br />
            <br />
            <span className="font-medium">Note:</span> Your video is{" "}
            <strong>never recorded</strong>. You can disable your webcam at any
            time.
          </AlertDescription>
        </div>
      </Alert>
        </div>
        {interview?.questions && interview?.questions.length >0 && (
            <div className='mt-4 w-full flex flex-col items-start gap-4'>
               <QuestionsForm questions={interview?.questions}/> 
            </div>

        )}
    </div> 
  )
}

export default MockInterviewPage