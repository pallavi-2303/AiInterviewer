import { useAuth } from "@clerk/clerk-react";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import Tooltipbutton from "./tooltipbutton";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import SaveModal from "./SaveModal";
import SaveUser from "@/Hooks/AuthUser";
import axios from "axios";


const RecordAnswer = ({ question, isWebCam, setIsWebCam }) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: false,
    useLegacyResults: false,
  });
  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const { interviewId } = useParams();
  const recordNewAnswer = async () => {
    console.log("new");
    setUserAnswer("");
    stopSpeechToText();
    setTimeout(() => {
      startSpeechToText();
    }, 300);
  };
  const SaveUserAnswer = async() => {
setLoading(true);
if(!aiResult)  {
    return;
     } 
const currentQuestion=question.question;
try {
 const payload={
    mockIdRef:interviewId,
    question:currentQuestion,
    correct_ans:question.answer,
    user_ans:userAnswer,
    feedback:aiResult.feedback,
    rating:aiResult.ratings,
    userId
 }
 const response=await axios.post("https://aiinterviewer-87mp.onrender.com/userAnswer/usersave",payload,{
    withCredentials:true
 });
 toast.success("Saved",{
    description:response.data.message
 });
 setUserAnswer("");
 stopSpeechToText();
} catch (error) {
 console.log("Error",error) ;
 toast.error("Error",{
    description:"Error occured while saving the results"
 })  
} finally{
    setLoading(false);
}
  };
  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
      setTimeout(() => {
        if (userAnswer?.length < 30) {
          toast.error("Error", {
            description: "Your Answer should be more than 30 characters.",
          });
        }
      }, 500);
      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );
      console.log("airesult", aiResult);
      setAiResult(aiResult);
    } else {
      startSpeechToText();
    }
  };
  const cleanAiResponse = (responseText) => {
    //step->1 Trim any surrounding white spaces
    let cleanText = responseText.trim();
    // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    //step-3 parse the clean json data into array of an object
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error(
        "Invalid JSON format: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };
  const generateResult = async (qst, qstAns, userAns) => {
    setIsAiGenerating(true);
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;
    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const parsedResult = cleanAiResponse(aiResult.response.text());
      return parsedResult;
    } catch (error) {
      console.log("Error generating the result", error);
      toast.error("Error", {
        description: "An Error Occured while generating feedback",
      });
      return { ratings: 0, feedback: "Unable to Generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };
  useEffect(() => {
    const combineTranscripts = results
      .map((result) =>
        typeof result === "string" ? result : result.transcript
      ) // Handle both cases
      .join(" ");
    setUserAnswer(combineTranscripts);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      
      {/* save model */}
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={SaveUserAnswer}
        loading={loading}
      />
      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          <Webcam
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>
      <div className="flex justify-center gap-3 items-center">
        <Tooltipbutton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={
            isWebCam ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
        />
        <Tooltipbutton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={recordUserAnswer}
        />
        <Tooltipbutton
          content={"Record Again"}
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
        />
        <Tooltipbutton
          content={"Save Result"}
          icon={
            isAiGenerating ? (
              <Loader className="animate-spin min-w-5 min-h-5" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setOpen(!open)}
          disabled={!aiResult}
        />
      </div>
      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <h2 className="font-serif font-semibold text-lg">Your Answer:</h2>
        <p className="text-sm text-gray-700 mt-2 whitespace-normal">
          {userAnswer || "Start Recording to see your Answer here"}
        </p>
        {interimResult && (
          <p className="tex-sm mt-2 text-gray-600">
            <strong>Current Speech:</strong>
            {interimResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecordAnswer;
