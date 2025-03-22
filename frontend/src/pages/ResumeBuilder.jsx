import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Controller, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import Entryform from "@/components/ui/Entryform";
import { Input } from "@/components/ui/input";
import { useAuth, useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { entriesToMarkdown } from "@/lib/helper2";
import { toast } from "sonner";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const ResumeBuilder = ({ initialcontent }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [resumeMode, setResumeMode] = useState("preview");
  const { user } = useUser();
  const userId=user?.id;
  const resumeRef = useRef(null);
  const [previewContent, setPreviewContent] = useState(initialcontent);
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
    control,
    register,
    handleSubmit,
    watch,
    getValues, 
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });
  // const {
  //   loading: isSaving,
  //   fn: saveResumeFn,
  //   data: saveResult,
  //   error: saveError,
  // } = useFetch(saveResume);
  const formValues = watch();
  useEffect(() => {
    if (initialcontent) {
      setActiveTab("preview");
    }
  }, [initialcontent]);
  //update the preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialcontent);
    }
  }, [formValues, activeTab]);
  const saveResume = async (content) => {
    setIsSaving(true); // Start saving process
    console.log("content",content);
   try {
  const response=await axios.post(`http://localhost:8000/resume/save/${user.id}`,{
    content });
    console.log(response);
    toast.success("Resume saved successfully"); 
   } catch (error) {
    console.error("Error saving resume:", error);
    toast.error("Failed to save resume");
   } finally {
    setIsSaving(false); // End saving process
 } 
  }
 
  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedIn)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedIn})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
      \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };
  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const generatePDF = async () => {
    const formData = getValues();  // Ensure this is populated
    console.log(formData);  // Check if the data is being fetched properly
  
    if (!formData) {
      alert("Form data is empty. Please fill out the form.");
      return;
    }
    setIsGenerating(true);
    try {
      const input = document.getElementById("resume");
console.log(input);

if (!input) {
  alert("Resume preview not found. Make sure it is rendered before generating PDF.");
  return;
}
      // Set the options for html2canvas to capture the full content
      const options = {
        scale: 2, // Increase the scale to improve the quality
        useCORS: true,
      };
  
      html2canvas(input, options).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
         // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if necessary
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("resume.pdf");
    });
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();
      console.log( formattedContent);
      await saveResume(formattedContent);
    } catch (error) {
      console.log("Error saving resume:", error);
    }
  };
  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-3xl md:text-5xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save
              </>
            )}
          </Button>
          <Button
            onClick={handleSubmit(generatePDF)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> DownLoad PDF
              </>
            )}
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
               
                <div className="space-y-4">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    {...register("contactInfo.email")}
                    placeholder="Enter your email"
                    error={errors?.contactInfo?.email}
                  />
                  {errors?.contactInfo?.email && (
                    <p className="text-red-500 text-sm">
                      {errors?.contactInfo?.email?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    type="tel"
                    {...register("contactInfo.mobile")}
                    placeholder="Enter your mobile number"
                    error={errors?.contactInfo?.mobile}
                  />
                  {errors?.contactInfo?.mobile && (
                    <p className="text-red-500 text-sm">
                      {errors?.contactInfo?.mobile?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">LinkedIn</label>
                  <Input
                    type="url"
                    {...register("contactInfo.linkedIn")}
                    placeholder="https://linkedin.com/yourhandle"
                    error={errors?.contactInfo?.linkedIn}
                  />
                  {errors?.contactInfo?.linkedIn && (
                    <p className="text-red-500 text-sm">
                      {errors?.contactInfo?.linkedIn?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Twitter</label>
                  <Input
                    type="url"
                    {...register("contactInfo.twitter")}
                    placeholder="https://twitter.com/yourhandle"
                    error={errors?.contactInfo?.twitter}
                  />
                  {errors?.contactInfo?.twitter && (
                    <p className="text-red-500 text-sm">
                      {errors?.contactInfo?.twitter?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">
                Professional Summary
              </label>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary"
                    error={errors?.summary}
                  />
                )}
              />
              {errors?.summary && (
                <p className="text-red-500 text-sm">
                  {errors?.summary?.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your Key Skills"
                    error={errors?.skills}
                  />
                )}
              />
              {errors?.skills && (
                <p className="text-red-500 text-sm">
                  {errors?.skills?.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <Entryform
                    type="Experience"
                    entries={field.value ||[]}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.experience && (
                <p className="text-red-500 text-sm">
                  {errors?.experience?.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <Entryform
                    type="Education"
                    entries={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.education && (
                <p className="text-red-500 text-sm">
                  {errors?.education?.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Project</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <Entryform
                    type="Project"
                    entries={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.projects && (
                <p className="text-red-500 text-sm">
                  {errors?.projects?.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  {" "}
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}
          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          
            <div id="resume">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
        
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
