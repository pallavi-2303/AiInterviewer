import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomBreadCrumb from "./CustomBreadCrumb";
import Headings from "./Headings";
import { Button } from "./button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./separator";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { toast } from "sonner";
import axios from "axios";
import { chatSession } from "@/scripts";

const formSchema = z.object({
  position: z.string().min(1, "Position is required").max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce.number().min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

const FormMockInterview = ({ initialData }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      position: "",
      description: "",
      experience: "",
      techStack: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();


  const title = initialData?.position || "Create a new Mock Interview";
  const breadCrumbPage = initialData?.position || "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };
const cleanAiResponse=(responseText)=>{
  //step->1 Trim any surrounding white spaces
  let cleanText=responseText.trim();
  // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
  cleanText = cleanText.replace(/(json|```|`)/g, "");

  // Step 3: Extract a JSON array by capturing text between square brackets
  const jsonArrayMatch = cleanText.match(/\[.*\]/s);
  if(jsonArrayMatch){
    cleanText=jsonArrayMatch[0];
  }
  else {
    throw new Error("No json found in response");
  }
  //step-4 parse the clean json data into array of an object
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    throw new Error("Invalid JSON format: " + (error instanceof Error ? error.message : String(error)));
  }

}
const generateAiResponse=async(data)=>{
  const prompt = `
  As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

  [
    { "question": "<Question text>", "answer": "<Answer text>" },
    ...
  ]

  Job Information:
  - Job Position: ${data?.position}
  - Job Description: ${data?.description}
  - Years of Experience Required: ${data?.experience}
  - Tech Stacks: ${data?.techStack}

  The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
  `;
  const aiResult=await chatSession.sendMessage(prompt);
  const cleanResponse=cleanAiResponse(aiResult.response.text())
  return cleanResponse;
}
  const onSubmit = async (data) => {
    console.log("Form clicked");
    console.log("Form Data:", data);

    try {
      setLoading(true);
let response;
      if (initialData) {
      if(isValid){
const aiResult=await generateAiResponse(data);
response=await axios.put(`https://aiinterviewer-87mp.onrender.com/interview/${initialData._id}`,{
  questions:aiResult,
  ...data,
  updatedAt:new Date(),
},{
  withCredentials:true
})
toast.success("Interview Updated Successfully")
      }
      } else {
        if(isValid){
        //create a new mock interview
      const aiResult=await generateAiResponse(data)
       response= await axios.post("https://aiinterviewer-87mp.onrender.com/interview/create", {
        ...data,
        userId,
        questions:aiResult,
        createdAt:new Date().toISOString(),
       }, {
          withCredentials: true,
        });
        
      toast.success("Success!", { description: response.data.message});}}
      navigate("/generate", { replace: true });
    } catch (error) {
      console.error("error",error);
      toast.error("Error", {
        description: "Something went wrong.. Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb breadCrumbPage={breadCrumbPage} breadCrumpItems={[{ label: "Mock Interview", link: "/generate" }]} />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} />
        {initialData && (
          <Button size="sm" variant="ghost">
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-8 rounded-lg flex-col items-center justify-start gap-6 shadow-md">
          
          <FormField control={form.control} name="position" render={({ field }) => (
            <FormItem className="w-full space-y-4">
              <div className="w-full flex items-center justify-between">
                <FormLabel>Job Role / Job Position</FormLabel>
                <FormMessage className="text-sm" />
              </div>
              <FormControl>
                <Input className="h-12" disabled={loading} placeholder="eg:-Full Stack Developer" {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem className="w-full space-y-4">
              <div className="w-full flex items-center justify-between">
                <FormLabel className="my-4">Job Description</FormLabel>
                <FormMessage className="text-sm" />
              </div>
              <FormControl>
                <Textarea className="h-12" disabled={loading} placeholder="eg:-describe your job role" {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="experience" render={({ field }) => (
            <FormItem className="w-full space-y-4">
              <div className="w-full flex items-center justify-between">
                <FormLabel className="my-4">Years of Experience</FormLabel>
                <FormMessage className="text-sm" />
              </div>
              <FormControl>
                <Input type="number" className="h-12" disabled={loading} placeholder="eg:- 5 Years" {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="techStack" render={({ field }) => (
            <FormItem className="w-full space-y-4">
              <div className="w-full flex items-center justify-between">
                <FormLabel className="my-4">Tech Stacks</FormLabel>
                <FormMessage className="text-sm" />
              </div>
              <FormControl>
                <Textarea className="h-12" disabled={loading} placeholder="eg:- React, Typescript..." {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )} />

          <div className="w-full flex items-center justify-end gap-6">
            <Button className="my-4" type="reset" size="sm" variant="outline" disabled={isSubmitting || loading}>Reset</Button>
            <Button type="submit" size="sm" disabled={isSubmitting || loading || !isValid}>
              {loading ? <Loader className="text-gray-500 animate-spin" /> : actions}
            </Button>
          </div>

        </form>
      </FormProvider>
    </div>
  );
};

export default FormMockInterview;
