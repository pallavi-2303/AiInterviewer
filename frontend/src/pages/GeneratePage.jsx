import { Footer } from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const GeneratePage = () => {
  return (
    <div className='flex-col md:px-12'>
        <Outlet/>
    </div>
  )
}

export default GeneratePage