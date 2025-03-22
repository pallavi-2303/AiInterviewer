import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import NavigationRoutes from './NavigationRoutes'
import { NavLink } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { cn } from '@/lib/utils'
import SaveUser from '@/Hooks/AuthUser'
  
const ToggleContainer = () => {

const {userId}=useAuth();
const {user}=useUser();
  return (
    <>
    <SaveUser/>
    <Sheet>
    <SheetTrigger className='block md:hidden'><Menu/></SheetTrigger>
    <SheetContent>
      <SheetHeader>
    <nav className='gap-6 flex flex-col items-start'> <NavigationRoutes isMobile/>
      {userId && (
         <NavLink
         to="/generate"
         className={({ isActive }) =>
           cn(
             "text-base text-neutral-500",
             isActive && "text-neutral-900 font-semibold"
           )
         }
       >
         Take An Interview
       </NavLink>
      )}
       {userId && (
         <NavLink
         to="/resume"
         className={({ isActive }) =>
           cn(
             "text-base text-neutral-500",
             isActive && "text-neutral-900 font-semibold"
           )
         }
       >
         Resume Builder
       </NavLink>
      )}
         {userId && (
                    <NavLink
                      to="/ai-cover-letter"
                      className={({ isActive }) =>
                        cn(
                          "text-base text-neutral-500",
                          isActive && "text-neutral-900 font-semibold"
                        )
                      }
                    >
                      Cover-Letter Generator
                    </NavLink>
                    
                  )}
      </nav> 
      </SheetHeader>
    </SheetContent>
  </Sheet></>
  )
}

export default ToggleContainer