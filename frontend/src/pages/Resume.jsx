import { Button } from '@/components/ui/button'
import { Download, Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Controller, set, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";
import { Input } from 'postcss'
import { Textarea } from '@/components/ui/textarea'
import Entryform from '@/components/ui/Entryform'
const Resume = ({initialcontent}) => {
const contactSchema=z.object({
    email:z.string().email("Invalid Email Address"),
    mobile:z.string().optional(),
    linkedIn:z.string().optional(),
    github:z.string().optional(),
    twitter:z.string().optional(),
});
const entrySchema=z.object({
    title:z.string().min(1,"Title is required"),
    organisation:z.string().min(1,"Organisation is required"),
    startDate:z.string().min(1,"Start Date is required"),
    endDate:z.string().optional(),
    description:z.string().min(1,"Description is required"),
    current:z.boolean().default(false),
})
.refine((data)=>{
if(!data.current && !data.endDate){
    return false;
}
return true;},
{
    message:"End Date is required until this is your current job",
    path:["endDate"]

});
const resumeSchema=z.object({
    contactInfo:contactSchema,
    summary:z.string().min(1,"Professional Summary is required"),
    skills:z.string().min(1,"Skills are required"),
    experience:z.array(entrySchema),
    education:z.array(entrySchema),
    projects:z.array(entrySchema), 
});
const [activeTab,setActiveTab]=useState('edit');
const {control,register,handleSubmit,watch,formState:{errors}}=useForm({resolver:zodResolver(resumeSchema),defaultValues:{
    contactInfo:{ },
    summary:"",
    skills:"",
    experience:[],
    education:[],
    projects:[], 
},})
const formValues=watch();
useEffect(()=>{
if(initialcontent){
    setActiveTab('preview');
}
},[initialcontent]);
  return (
    <div className='space-y-4'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
            <h1 className='font-bold gradient-title text-3xl md:text-5xl'>Resume Builder</h1>
        </div>
   
   <div className='space-x-4'>
   <Button >
    <Save className='h-4 w-4'/> Save</Button> 
    <Button >
    <Download className='h-4 w-4'/> DownLoad</Button> 
    </div>


    <Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="edit">Form</TabsTrigger>
    <TabsTrigger value="preview">Markdown</TabsTrigger>
  </TabsList>
  <TabsContent value="edit"><form>
   <div>
  <h3 className='text-lg font-medium'>Contact Information</h3>  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
  <div className='space-y-4'>
<label className='text-sm font-medium'>Email</label>
<Input type="email" {...register('contactInfo.email')}
placeholder='Enter your email' 
error={errors?.contactInfo?.email}
/>
{errors?.contactInfo?.email && (<p className='text-red-500 text-sm'>{errors?.contactInfo?.email?.message}</p>)}
  </div>
  <div className='space-y-4'>
<label className='text-sm font-medium'>Email</label>
<Input type="email" {...register('contactInfo.email')}
placeholder='Enter your email' 
error={errors?.contactInfo?.email}
/>
{errors?.contactInfo?.email && (<p className='text-red-500 text-sm'>{errors?.contactInfo?.email?.message}</p>)}
  </div>

  <div className='space-y-4'>
<label className='text-sm font-medium'>Mobile Number</label>
<Input type="tel" {...register('contactInfo.mobile')}
placeholder='Enter your mobile number' 
error={errors?.contactInfo?.mobile}
/>
{errors?.contactInfo?.mobile && (<p className='text-red-500 text-sm'>{errors?.contactInfo?.email?.message}</p>)}
  </div>
  <div className='space-y-4'>
<label className='text-sm font-medium'>LinkedIn</label>
<Input type="url" {...register('contactInfo.linkedIn')}
placeholder='https://linkedin.com/yourhandle' 
error={errors?.contactInfo?.linkedIn}
/>
{errors?.contactInfo?.linkedIn && (<p className='text-red-500 text-sm'>{errors?.contactInfo?.linkedIn?.message}</p>)}
  </div>
  <div className='space-y-4'>
<label className='text-sm font-medium'>LinkedIn</label>
<Input type="url" {...register('contactInfo.twitter')}
placeholder='https://twitter.com/yourhandle' 
error={errors?.contactInfo?.linkedIn}
/>
{errors?.contactInfo?.twitter && (<p className='text-red-500 text-sm'>{errors?.contactInfo?.twitter?.message}</p>)}
  </div>      
  </div>
    </div> 
    <div className='space-y-4'>
<label className='text-sm font-medium'>Professional Summary</label>
<Controller name="summary" control={control} render={({field})=>(
   <Textarea {...field} className="h-32" placeholder='Write a compelling professional summary' error={errors?.summary}/> 
)}/>
{errors?.summary && (<p className='text-red-500 text-sm'>{errors?.summary?.message}</p>)}
  </div>

  <div className='space-y-4'>
<h3 className='text-sm font-medium'>Skills</h3>
<Controller name="skills" control={control} render={({field})=>(
   <Textarea {...field} className="h-32" placeholder='List yyour Key Skills' error={errors?.skills}/> 
)}/>
{errors?.skills && (<p className='text-red-500 text-sm'>{errors?.skills?.message}</p>)}
  </div>
  <div className='space-y-4'>
<h3 className='text-sm font-medium'>Work Experience</h3>
<Controller name="experience" control={control} render={({field})=>(
   <Entryform type="Experience" entries={field.value} onChange={field.onChange}/> 
)}/>
{errors?.experience && (<p className='text-red-500 text-sm'>{errors?.experience?.message}</p>)}
  </div>
  <div className='space-y-4'>
<h3 className='text-sm font-medium'>Education</h3>
<Controller name="education" control={control} render={({field})=>(
   <Entryform type="Education" entries={field.value} onChange={field.onChange}/> 
)}/>
{errors?.education && (<p className='text-red-500 text-sm'>{errors?.education?.message}</p>)}
  </div>
   <div className='space-y-4'>
<h3 className='text-sm font-medium'>Project</h3>
<Controller name="project" control={control} render={({field})=>(
   <Entryform type="Project" entries={field.value} onChange={field.onChange}/> 
)}/>
{errors?.project && (<p className='text-red-500 text-sm'>{errors?.project?.message}</p>)}
  </div>
    </form></TabsContent>
  <TabsContent value="preview">Change your password here.</TabsContent>
</Tabs>
     </div>
  )
}

export default Resume