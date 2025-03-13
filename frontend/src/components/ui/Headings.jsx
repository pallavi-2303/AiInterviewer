import { cn } from '@/lib/utils'
import React from 'react'

const Headings = ({title,description ,isSubHeading=false}) => {
  return (
    <div className=''>
<h2 className={cn("text-2xl md:text-3xl text-gray-800 font-semibold font-sans",isSubHeading && "text-lg md:text-xl")}>{title}</h2>
{description && (
    <p className='text-sm text-muted-foreground'>{description}</p>
)}
    </div>
  )
}

export default Headings