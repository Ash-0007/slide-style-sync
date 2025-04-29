
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
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
    <Card className="w-full animate-fade-in glass-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
              ${dragging ? 'border-mountbatten bg-thistle/20' : 'border-thistle hover:border-mountbatten/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-10 w-10 text-mountbatten" />
              <p className="text-sm text-spacecadet/70">
                Drag and drop your PowerPoint file here, or <span className="text-mountbatten font-medium">browse</span>
              </p>
              <p className="text-xs text-spacecadet/50">Only .pptx files are supported</p>
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
            <div className="flex items-center justify-between bg-thistle/30 p-3 rounded-lg animate-fade-in">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-mountbatten" />
                <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
              </div>
              <Button 
                onClick={onAnalyzeClick} 
                className="bg-mountbatten hover:bg-mountbatten/80 text-white"
              >
                Analyze
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
