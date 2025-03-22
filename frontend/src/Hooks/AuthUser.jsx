import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

const SaveUser=()=>{
    const {user}=useUser();
    useEffect(()=>{
if(user){
 axios.post("https://aiinterviewer-87mp.onrender.com/user/save-user",{
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    emailAddresses: user.emailAddresses.map(email => email.emailAddress),
    imageUrl: user.imageUrl,  
 },{
  headers:{
    'Content-Type':'application/json'
  } ,
  withCredentials:true 
 })
 .then(response => console.log("User saved:", response.data))
        .catch(error => console.error("Error saving user:", error));
    }


    },[user])
    return null;
}
export default SaveUser;