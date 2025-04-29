
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  label: string;
  roleTitle: string;
  roleName: string;
  onImageSelected: (role: string, file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, roleTitle, roleName, onImageSelected }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file));
        onImageSelected(`${roleName}_image`, file);
      } else {
        toast.error('Please select an image file.');
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageSelected(`${roleName}_image`, null);
  };

  const imageId = `${roleName}-image-upload`;

  return (
    <div className="flex flex-col items-center space-y-2 py-2">
      <label htmlFor={imageId} className="text-sm font-medium mb-1 text-center">
        {label}
      </label>
      
      <div className="relative">
        <Avatar className="w-24 h-24 border-2 border-dashed border-purple hover:border-purple-light transition-colors cursor-pointer">
          {imagePreview ? (
            <>
              <AvatarImage src={imagePreview} className="object-cover" />
              <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <AvatarFallback className="bg-purple-light/20 flex flex-col items-center justify-center p-2">
              <UploadCloud className="h-8 w-8 text-purple" />
              <span className="text-[10px] text-purple mt-1">Upload</span>
            </AvatarFallback>
          )}
        </Avatar>
        
        <input
          id={imageId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      
      <p className="text-xs text-muted-foreground font-medium">
        {roleTitle}
      </p>
    </div>
  );
};

export default ImageUpload;
