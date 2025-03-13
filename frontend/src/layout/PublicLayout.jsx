import {Footer} from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <div className='w-full'>
     <Header/>
     <Outlet/>
     <Footer/>
    </div>
  )
}

export default PublicLayout;