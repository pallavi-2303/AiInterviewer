import React from 'react'
import { cn } from '@/lib/utils'
const Container = ({children,className}) => {
  return (
    <div className={cn("container mx-auto px-4 md:px-8 py-4 w-full",className)}>{children}</div>
  )
}

export default Container