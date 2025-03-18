import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import {  useForm } from "react-hook-form";
import { Button } from "./button";
import { Loader2, PlusCircle, Sparkles, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import useFetch from "@/Hooks/UseFetch";
import { format, parse } from "date-fns";
import { z } from "zod";
import { useUser } from "@clerk/clerk-react";
const formatDisplayDate = (dateString) => {
  if (dateString) {
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  }
};
const Entryform = ({ type, entries, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
const {user}=useUser();
 const contactSchema = z.object({
    email: z.string().email("Invalid Email Address"),
    mobile: z.string().optional(),
    linkedIn: z.string().optional(),
    github: z.string().optional(),
    twitter: z.string().optional(),
  });
  const entrySchema = z
    .object({
      title: z.string().min(1, "Title is required"),
      organisation: z.string().min(1, "Organisation is required"),
      startDate: z.string().min(1, "Start Date is required"),
      endDate: z.string().optional(),
      description: z.string().min(1, "Description is required"),
      current: z.boolean().default(false),
    })
    .refine(
      (data) => {
        if (!data.current && !data.endDate) {
          return false;
        }
        return true;
      },
      {
        message: "End Date is required until this is your current job",
        path: ["endDate"],
      }
    );
    const resumeSchema = z.object({
      contactInfo: contactSchema,
      summary: z.string().min(1, "Professional Summary is required"),
      skills: z.string().min(1, "Skills are required"),
      experience: z.array(entrySchema),
      education: z.array(entrySchema),
      projects: z.array(entrySchema),
    });
    const {
      register,
      handleSubmit: handleValidation,
      reset,
      watch,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(entrySchema),
      defaultValues: {
        title: "",
        organisation: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false,
      },
    });
  const current = watch("current");
const improveWithAI=async({current,type})=>{
  const prompt = `
  As an expert resume writer, improve the following ${type} description for a ${user?.industry} professional.
  Make it more impactful, quantifiable, and aligned with industry standards.
  Current content: "${current}"

  Requirements:
  1. Use action verbs
  2. Include metrics and results where possible
  3. Highlight relevant technical skills
  4. Keep it concise but detailed
  5. Focus on achievements over responsibilities
  6. Use industry-specific keywords
  
  Format the response as a single paragraph without any additional text or explanations.
`;
try {
  const result =await chatSession.sendMessage(prompt);
  const response=result.response;
  const improvedContent = response.text().trim();
  return improvedContent;
} catch (error) {
  console.error("Error improving content:", error);
  throw new Error("Failed to improve content");
}
}
const {
  loading: isImproving,
  fn: improveWithAIfn,
  data: improvedContent,
  error: improveError,
} = useFetch(improveWithAI);
 
  
  //Add to handle the results
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully");
    }
    if (improveError) {
      console.log(improveError);
      toast.error("Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving]);
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Description is required");
      return;
    }
    await improveWithAIfn({
      current: description,
      type: type.toLowerCase(),
    });
  };
  const handleAdd = (data) => {
    console.log("HandleAdd Called");
    console.log("data",data);
    console.log("clicked");
    const FormatttedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: formatDisplayDate(data.endDate),
    };
    onChange([...entries, FormatttedEntry]);
    reset();
    setIsAdding(false);
  };
  const handleDelete = async (index) => {
  const newEntries=entries.filter((_,i)=>i!=index);
  onChange(newEntries);
  };
 
  return (
    <div className="space-y-4">
      <div className="space-y-4">
{entries?.map((item, index) => (
 <Card key={index}>
 <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
   <CardTitle className="text-sm font-medium">{item?.title} @ {item.organisation}</CardTitle>
   <Button variant="outline" size="icon" type="button" onClick={()=>handleDelete(index)}><X className="w-4 h-4"/></Button>
 </CardHeader>
 <CardContent>
   <p className="text-sm text-muted-foreground">{item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}</p>
   <p className="mt-2 text-sm white-pre-wrap">{item.description}</p>
 </CardContent>
</Card>

))}
      </div>
    {isAdding && (
      <Card>
        <CardHeader>
          <CardTitle>Add {type}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                placeholder="Title/Position"
                {...register("title")}
                error={errors.title}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Organisation/Company"
                {...register("organisation")}
                error={errors.organisation}
              />
              {errors.organisation && (
                <p className="text-red-500">{errors.organisation.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                type="month"
                {...register("startDate")}
                error={errors.startDate}
              />
              {errors.startDate && (
                <p className="text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-4">
              <Input
                type="month"
                disabled={current}
                {...register("endDate")}
                error={errors.startDate}
              />
              {errors.endDate && (
                <p className="text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="current"
              {...register("current")}
              onChange={(e) => {
                setValue("current", e.target.checked);
                if (e.target.checked) {
                  setValue("endDate", "");
                }
              }}
            />

            <label htmlFor="current">Current {type}</label>
          </div>
          <div className="space-y-4">
            <Textarea
              placeholder="Description"
              {...register("description")}
              className="h-32"
              error={errors.description}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <Button
            variant="ghost"
            type="button"
            size="sm"
            onClick={handleImproveDescription}
            disabled={isImproving || !watch("description")}
          >
            {isImproving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Improving..
              </>
            ) : (
              <>
                <Sparkles />
                Improve with Ai
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setIsAdding(false);
            }}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleValidation(handleAdd)}>
            <PlusCircle />
            Add Entry
          </Button>
        </CardFooter>
      </Card>)}

      {!isAdding && (
        <Button
          className="w-full"
          varaint="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle />
          Add{type}
        </Button>
      )}
    </div>
  );
};
export default Entryform;
