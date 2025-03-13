import { Loader } from 'lucide-react'
import React from 'react'

const LoadingPage = () => {
  return (
    <div className='w-screen h-screen flex tems-center justify-center bg-transparent z-50'>
        <Loader className='h-6 w-6 min-w-6 animate-spin'/>
    </div>
  )
}

export default LoadingPage