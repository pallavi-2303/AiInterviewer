import MDEditor from '@uiw/react-md-editor'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useState } from 'react'
import { Button } from './button';
import { Download, Edit, Monitor } from 'lucide-react';

const CoverLetterPreview = ({content}) => {
const [previewContent,setPreviewContent]=useState(content);
const [resumeMode,setResumeMode]=useState('edit');
const [isGenerating,setIsGenerating]=useState(false);
const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const input = document.getElementById("coverLetter");
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

      pdf.save("coverLetter.pdf");
    });
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div data-color-mode="light" className='border rounded-lg py-4 space-y-4 '>
        <div>
            <div className='flex justify-between items-center mb-4'>
            <Button className="ml-4" variant="outline" onClick={()=>setResumeMode(resumeMode==='edit' ? 'preview' : 'edit')}>
{resumeMode==='edit' ? <><Monitor className='w-4' h-4/> Preview</> :<><Edit className='w-4 h-4' /> Edit</>}
            </Button>
            <Button
            className="mr-4"
            onClick={generatePDF}
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
          </Button></div>
          {resumeMode==='edit' && (
            <MDEditor value={previewContent}
            onChange={setPreviewContent}
            height={800}
            preview="edit"/>
          ) }
            {resumeMode==='preview' && (
            <div id="coverLetter" className='p-4 '>
            <MDEditor.Markdown
              source={previewContent}
              style={{
                background: "white",
                color: "black",
              }}
            />
          </div> 
          
          )}
        </div>
    </div>
  )
}

export default CoverLetterPreview