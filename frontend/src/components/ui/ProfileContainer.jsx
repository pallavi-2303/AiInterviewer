import { useAuth, UserButton } from '@clerk/clerk-react'
import { Loader } from 'lucide-react';
import React from 'react'
import { Button } from './button';
import { Link } from 'react-router-dom';

const ProfileContainer = () => {
const {isSignedIn,isLoaded}=useAuth();
if(!isLoaded){
    return (
        <div className='flex items-center'>
            <Loader className='h-6 w-6 animate-spin text-emerald-500'></Loader>
        </div>
    )
}
  return (
    <div className='flex items-center gap-6'>{isSignedIn ? <UserButton afterSignOutUrl='/'/> :
 <Link to={"/signin"}> <Button size={"sm"}>Get Started</Button></Link> 
    }</div>
  )
}

export default ProfileContainer