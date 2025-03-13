import LoadingPage from '@/pages/LoadingPage';
import { useAuth } from '@clerk/clerk-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
const navigate=useNavigate();
const {isLoaded,isSignedIn}=useAuth();
if(!isLoaded){
return <LoadingPage/>
}
if(!isSignedIn){
navigate("/signin");
}
  return (
    <div>{children}</div>
  )
}

export default ProtectedRoute;