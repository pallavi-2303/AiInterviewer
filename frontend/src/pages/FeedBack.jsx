import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import CustomBreadCrumb from "@/components/ui/CustomBreadCrumb";
import axios from "axios";
import Header from "@/components/ui/Header";
import Headings from "@/components/ui/Headings";
import InterviewPin from "@/components/ui/InterviewPin";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FeedBack = () => {
const navigate=useNavigate();
  const { userId } = useAuth();
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedBacks] = useState([]);
  const [activeFeed, setActiveFeed] = useState("");
  if (!interviewId) {
    navigate("/generate", { replace: true });
  }
  useEffect(() => {
    const fetchInterviewById = async () => {
      if (interviewId) {
        try {
          const response = await axios.get(
            `http://localhost:8000/interview/interviewById/${interviewId}`
          );
    

          setInterview(response.data.interview);
        } catch (error) {
          console.log(error);
        }
      }
    };
const fetchFeedbacks=async()=>{
setLoading(true);
try {
const response=await axios.get(`http://localhost:8000/userAnswer/feedbacks/${userId}/${interviewId}`) ;
console.log(response.data);
setFeedBacks(response.data)  ; 
} catch (error) {
  console.log("Error",error) ;
  toast.error("Error",{
    description:"Something went wrong . Please Try Again Later.."
  })
} finally{
    setLoading(false);
}
}

    fetchInterviewById();
    fetchFeedbacks();
  }, [interviewId,navigate,userId]);
  const overAllRating = useMemo(() => {
    if (feedbacks?.length === 0) return "0.0";

    const totalRatings = feedbacks?.reduce(
      (acc, feedback) => acc + feedback?.rating,
      0
    );

    return (totalRatings / feedbacks?.length).toFixed(1);
  }, [feedbacks]);

  if(loading){
    return <LoadingPage/>
  }
  return <div className="flex flex-col w-full gap-8 py-5">
    <div className="flex items-center justify-between w-full gap-2">
<CustomBreadCrumb
breadCrumbPage={"FeedBack"}
breadCrumpItems={[{label:"Mock Interview", link:"/generate"},
{label:`${interview?.position}`,link:`/generate/interview/${interviewId}`}
]}
/>
    </div>
    <Headings title={"Congratulations!"}
    description="Your personalised feedback is now here. Dive in to see your Strengths,areas for improvement and tips to help you ace your next interview."/>
    <p className="text-base text-muted-foreground">
Your Overall ratings :{" "}
<span className="text-emerald-600 font-semibold text-xl">{overAllRating}/10</span>
    </p>
    {interview && <InterviewPin interview={interview} onMockPage/>}
    <Headings title={"Interview Feedback"} isSubHeading/>
    {
        feedbacks && <Accordion type="single" collapsible value={activeFeed} onValueChange={(val)=>{console.log("Accordian Clicked",val) ;
          setActiveFeed(val) ;
        }} className="space-y-6">
{feedbacks?.map((feed)=>(

   <AccordionItem key={feed.id} value={String(feed.id)} className="border rounded-lg shadow-md">
    <AccordionTrigger  
  className={cn("px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline",
  activeFeed===String(feed.id) ? "bg-gradient-to-r from-purple-50 to-blue-50" : "hover:bg-gray-50")}
    >
    <span>{feed?.question}</span>
    </AccordionTrigger>
    <AccordionContent className="px-5 py-6 bg-white rounded-b-bg space-y-5 shadow-inner">
    <div className="text-lg font-semibold to-gray-700">
    <Star className="inline mr-2 text-yellow-500"/>
    Rating : {feed.rating}
    </div>
    <Card className="border-none rounded-lg space-y-3 p-4 bg-green-50 shadow-lg">
<CardTitle className="flex items-center text-lg">
    <CircleCheck className="mr-2 text-green-600"></CircleCheck> Expected Answer
</CardTitle>
<CardDescription className="font-medium text-gray-700">
   {feed?.correct_ans} 
</CardDescription>
    </Card>
    <Card className="border-none rounded-lg space-y-3 p-4 bg-yellow-50 shadow-lg">
<CardTitle className="flex items-center text-lg">
    <CircleCheck className="mr-2 text-yellow-600"></CircleCheck> Your Answer
</CardTitle>
<CardDescription className="font-medium text-gray-700">
   {feed?.user_ans} 
</CardDescription>
    </Card>
    <Card className="border-none rounded-lg space-y-3 p-4 bg-red-50 shadow-lg">
<CardTitle className="flex items-center text-lg">
    <CircleCheck className="mr-2 text-red-600"></CircleCheck> FeedBack
</CardTitle>
<CardDescription className="font-medium text-gray-700">
   {feed?.feedback} 
</CardDescription>
    </Card>
    </AccordionContent>
   </AccordionItem>
))}
        </Accordion>
    }
  </div>;
};

export default FeedBack;
