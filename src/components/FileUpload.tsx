
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
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, onAnalyzeClick, fileName }) => {
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
    <Card className="w-full animate-fade-in bg-white shadow-card hover:shadow-card-hover transition-all">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div 
            className={`file-upload-zone ${dragging ? 'border-deep-purple bg-primary/10' : 'border-neutral-300 hover:border-deep-purple/80'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-float">
                <Upload className="h-8 w-8 text-deep-purple" />
              </div>
              <div>
                <p className="text-base font-medium text-neutral-800 mb-1">
                  Drag and drop your PowerPoint file here
                </p>
                <p className="text-sm text-neutral-500">
                  or <span className="text-deep-purple font-medium">browse files</span>
                </p>
              </div>
              <p className="text-xs text-neutral-400">Only .pptx files are supported</p>
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
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-deep-purple/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-deep-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{fileName}</p>
                    <p className="text-xs text-neutral-500">PowerPoint Presentation</p>
                  </div>
                </div>
                <Button 
                  onClick={onAnalyzeClick} 
                  className="bg-deep-purple hover:bg-deep-purple/90 text-white shadow-button hover:shadow-button-hover transition-all"
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Analyze
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
