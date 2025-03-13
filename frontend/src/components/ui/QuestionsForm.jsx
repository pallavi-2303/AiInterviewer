import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from '@/lib/utils';
import Tooltipbutton from './tooltipbutton';
import { Volume2, VolumeX } from 'lucide-react';
import RecordAnswer from './RecordAnswer';

const QuestionsForm = ({questions}) => {
const [isPlaying,setIsPlaying]=useState(false);
const [isWebCamEnabled,setWebCamEnabled]=useState(false);
const [currentSpeech ,setCurrentSpeech]=useState(null);
const handlePlayQuestion=(question)=>{
if(isPlaying && currentSpeech){
  window.speechSynthesis.cancel();
  setIsPlaying(false);
  setCurrentSpeech(null);
}
else {
if("speechSynthesis" in window){
  const speech=new SpeechSynthesisUtterance(question);
  window.speechSynthesis.speak(speech);
  setIsPlaying(true);
  setCurrentSpeech(speech);
  //after completing the speech set it to null
  speech.onend=()=>{
   setIsPlaying(false);
   setCurrentSpeech(null);
  }
}
}
}
  return (
    <div className='w-full min-h-96 border rounded-md p-4'>
<Tabs defaultValue={questions[0].question} className="w-full space-y-12" orientation='vertical'>
  <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
    {questions?.map((tab,i)=>(
      <TabsTrigger className={cn("data-[state=active]:bg-emerald-300 data-[state=action]:shadow-lg text-xs px-2")} value={tab.question} key={tab.question}>{`Question #${i+1}`}</TabsTrigger>
    ))}
  </TabsList>
  {questions?.map((tab,i)=>(
  <TabsContent ket={i} value={tab.question}>
    <p className='text-base text-left tracking-wide text-neutral-600 '>{tab.question}</p>
    <div className='w-full flex items-center justify-end'>
      <Tooltipbutton
      content={isPlaying ? "Stop" :"Start"}
      icon={isPlaying ? (
        <VolumeX className='min-h-5 min-w-5 text-muted-foreground'/>
      ):(
        <Volume2 className='min-h-5 min-w-5 text-muted-foreground'/>
      )}
      onClick={()=>handlePlayQuestion(tab.question)}
      />
    </div>

    <RecordAnswer question={tab} isWebCam={isWebCamEnabled} setIsWebCam={setWebCamEnabled}/>
  </TabsContent>  
  ))}
</Tabs>

    </div>
  )
}

export default QuestionsForm