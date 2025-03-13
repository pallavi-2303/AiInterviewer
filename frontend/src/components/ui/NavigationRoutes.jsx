import { MainRoutes } from '@/lib/helper'
import { cn } from '@/lib/utils'
import React from 'react'
import { NavLink } from 'react-router-dom'

const NavigationRoutes = ({isMobile}) => {
  return (
    <ul className={cn('flex items-center gap-6',isMobile && "items-center flex-col gap-8")}>
        {MainRoutes.map((route)=>(
        <NavLink
        key={route.href}
        to={route.href}
        className={({isActive})=>
        cn("text-base text-neutral-500",isActive && "text-neutral-900 font-semibold")
        }
        >
{route.label}
        </NavLink>    
        ))}
    </ul>
  )
}

export default NavigationRoutes