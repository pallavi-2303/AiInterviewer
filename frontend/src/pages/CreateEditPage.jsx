import FormMockInterview from '@/components/ui/FormMockInterview';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const CreateEditPage = () => {
const {interviewId}=useParams();
const [interview,setInterview]=useState(null);
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
  return (
    <div className='my-4 flex-col w-full '><FormMockInterview initialData={interview}/></div>
  )
}

export default CreateEditPage