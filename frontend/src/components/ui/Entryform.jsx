import { zodResolver } from '@hookform/resolvers/zod'
import { title } from 'process'
import React from 'react'
import { useForm } from 'react-hook-form'
import { start } from 'repl'

const Entryform = ({type,entries,onChange}) => {
    const {register,handleSubmit:handleValidation,reset,watch,setValue,formState:{errors}}=useForm({resolver:zodResolver(resumeSchema),defaultValues:{
       title:"",
       organisation:"",
       startDate:"",
       endDate:"",
         description:"",
         current:false, 
    },})
  return (
    <div>Entryform</div>
  )
}

export default Entryform