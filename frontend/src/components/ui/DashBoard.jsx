import React, { useEffect, useState } from 'react'
import Headings from './Headings'
import { Link } from 'react-router-dom'
import { Button } from './button'
import { Plus } from 'lucide-react'
import { Separator } from './separator'
import { useAuth } from '@clerk/clerk-react'
import { Skeleton } from './skeleton'
import axios from 'axios'
import { toast } from 'sonner'
import InterviewPin from './InterviewPin'

const DashBoard = () => {
  const [interview,setInterview]=useState([]);
  const [loading,setLoading]=useState(false);
  const {userId}=useAuth();
  useEffect(()=>{
setLoading(true);
axios.get(`https://aiinterviewer-87mp.onrender.com/interview/${userId}`)
.then((response)=>{
  console.log(response);
  setInterview(response.data.interviews);
  console.log(response.data.interviews);
  setLoading(false);
})
.catch((error)=>{
  console.error("Error fetching interviews:", error);
  toast.error("Error fetching interviews.");
  setLoading(false);
})
  },[userId]);
  return (
    <>
    <div className='flex w-full items-center justify-between'>
        <Headings title="DashBoard"
        description="Create and Start your Ai Mock Interview"/>
        <Link to="/generate/create"><Button size={"sm"}><Plus/>Add New</Button></Link>
       
    </div>
    <Separator className="my-8"></Separator>
    {/*Content section*/}
    <div className='md:grid md:grid-cols-3 gap-3 py-4'>

      {loading ? Array.from({length:6}).map((_,index)=>(
    <Skeleton key={index}  className={"h-24 md:h-32 rounded-md"}/>  
      )) :(interview?.length>0 ? interview?.map((interview)=><InterviewPin key={interview?.id} interview={interview}/>) :
      <div className='md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col'>
      <img className='w-44 h-44 object-contain'  src="/svg/not-found.svg" alt="not found"/> 
      <h2 className='text-lg font-semibold text-muted-foreground'>No Data Found</h2>
      <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-4">
              There is no available data to show. Please add some new mock
              interviews
            </p>
            <Link to={`/generate/${interview?._id}`} className='mt-4'>
            <Button  size={"sm"}>
              <Plus className='min-w-5 min-h-5 mr-1 '/>
              Add New
            </Button>
            </Link>
        </div>)}
    </div>
    </>
  )
}

export default DashBoard