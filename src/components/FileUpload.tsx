import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, BarChart } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onAnalyzeClick: () => void;
  fileName: string | null;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, onAnalyzeClick, fileName, isLoading }) => {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.pptx')) {
        onFileSelected(file);
      } else {
        toast.error('Please select a PowerPoint (.pptx) file.');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.pptx')) {
        onFileSelected(file);
      } else {
        toast.error('Please select a PowerPoint (.pptx) file.');
      }
    }
  };

  return (
    <Card className="w-full animate-fade-in bg-card text-card-foreground shadow-card hover:shadow-card-hover transition-all">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div 
            className={`file-upload-zone border-border hover:border-midnight_green ${dragging ? 'border-midnight_green bg-midnight_green/10' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-midnight_green/20 flex items-center justify-center animate-float">
                <Upload className="h-8 w-8 text-midnight_green" />
              </div>
              <div>
                <p className="text-base font-medium mb-1">
                  Drag and drop your PowerPoint file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or <span className="text-midnight_green font-medium">browse files</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Only .pptx files are supported</p>
            </div>
            <Input 
              id="file-input"
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pptx"
            />
          </div>

          {fileName && (
            <div className="bg-muted p-4 rounded-lg border border-border animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-midnight_green/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-midnight_green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{fileName}</p>
                    <p className="text-xs text-muted-foreground">PowerPoint Presentation</p>
                  </div>
                </div>
                <Button 
                  onClick={onAnalyzeClick} 
                  className="bg-midnight_green hover:bg-midnight_green/90 text-mint_green shadow-button hover:shadow-button-hover transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
