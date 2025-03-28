import React, { useEffect, useState } from "react";
import ResumeBuilder from "./ResumeBuilder";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
const Resume = () => {
  const [resume, setResume] = useState(null);
  const { userId } = useAuth();
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(
          `https://aiinterviewer-87mp.onrender.com/resume/get/${userId}`
        );
        console.log(response);
        setResume(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };
    fetchResume();
  }, []);
  return (
    <div className="container mx-auto py-6">
        <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
};

export default Resume;
