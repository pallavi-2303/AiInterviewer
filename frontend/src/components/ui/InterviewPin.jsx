import { useAuth } from '@clerk/clerk-react';
import { Eye, Menu, Newspaper, Sparkles, User } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardDescription, CardFooter, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import Tooltipbutton from './tooltipbutton';

const InterviewPin = ({interview,onMockPage=false}) => {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const {userId}=useAuth();
  return (
    <Card className="p-4 rounded-md shadow-md hover:shadow-lg shadow-gray-100 transition-all space-y-4 mt-3">
        <CardTitle className="text-lg">{interview?.position}</CardTitle>
        <CardDescription>{interview?.description}</CardDescription>
        <div className='flex w-full items-center gap-2 flex-wrap'>
            {interview?.techStack.split(",").map((word,index)=>(<Badge variant={"outline"} className={"text-xs text-muted-foreground hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"}>
                {word}
            </Badge>))}
        </div>
        <CardFooter className={cn("w-full flex items-center p-0",onMockPage ? "justify-end" : "justify-between")}>
        <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
  {`${new Date(interview?.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })} - 
    ${new Date(interview?.createdAt).toLocaleTimeString("en-US", { timeStyle: "short" })}`}
</p>
{!onMockPage && (
    <div className='flex items-center justify-center gap-2'>
        <Tooltipbutton
        content="View"
        buttonVariant={'ghost'}
        onClick={()=>{
          navigate(`/generate/${interview?._id}`,{replace:true})  
        }}
        disabled={false}
        buttonClassName='hover:text-sky-500'
        icon={<Eye/>}
        loading={false}
        />
        <Tooltipbutton
        content="Feedback"
        buttonVariant={'ghost'}
        onClick={()=>{
          navigate(`/generate/feedback/${interview?._id}`,{replace:true})  
        }}
        disabled={false}
        buttonClassName='hover:text-yellow-500'
        icon={<Newspaper/>}
        loading={false}
        />
        <Tooltipbutton
        content="Start"
        buttonVariant={"ghost"}
        onClick={()=>{
          navigate(`/generate/interview/${interview?._id}`,{replace:true})  
        }}
        disabled={false}
        buttonClassName='hover:text-sky-500'
        icon={<Sparkles/>}
        loading={false}
        />
    </div>
)}

        </CardFooter>
    </Card>
  )
}

export default InterviewPin