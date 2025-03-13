import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { Button } from "@/components/ui/button";
  import { Loader } from "lucide-react";
const Tooltipbutton = ({content,icon,onClick,buttonVariant="ghost",buttonClassName="",delay=0,disabled=false,loading=false}) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger className={disabled ? "cursor-not-allowed" :"cursor-pointer"}>
          <Button size={"icon"}  variant={buttonVariant} disabled={disabled} className={buttonClassName} onClick={onClick}>
          {loading ? (
            <Loader className='min-w-4 min-h-4 animate-spin text-emerald-400 '></Loader>
          ) :(
            icon
          )}</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{loading ? "loading.." :content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Tooltipbutton;