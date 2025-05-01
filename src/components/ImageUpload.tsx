import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from '@/services/PresentationService';

interface ImageUploadProps {
  label: string;
  roleKey: string;
  roleName: string;
  onImageSelected: (roleKey: string, file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
  serverImages: string[];
}

const findMatchingServerImage = (name: string, serverImages: string[]): string | null => {
    if (!name) return null;
    const lowerName = name.toLowerCase().replace(/ /g, '');
    return serverImages.find(imgName => 
        imgName.toLowerCase().startsWith(lowerName) &&
        [ '.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => imgName.toLowerCase().endsWith(ext))
    ) || null;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  roleKey, 
  roleName,
  onImageSelected, 
  selectedFile,
  disabled = false,
  serverImages
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const newPreview = URL.createObjectURL(selectedFile);
      setImagePreview(newPreview);
      setServerImageUrl(null);
      return () => URL.revokeObjectURL(newPreview);
    } else {
      setImagePreview(null);
      const matchingFilename = findMatchingServerImage(roleName, serverImages);
      setServerImageUrl(matchingFilename 
          ? `${API_BASE_URL}/images/${encodeURIComponent(matchingFilename)}` 
          : null);
    }
  }, [selectedFile, roleName, serverImages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(roleKey, file);
      } else {
        toast.error('Please select an image file (jpg, png, gif, webp).');
      }
    } else {
      onImageSelected(roleKey, null);
    }
    e.target.value = ''
  };

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;
    onImageSelected(roleKey, null);
  };

  const inputId = `${roleKey}-upload`;
  
  return (
    <div className={`flex flex-col items-center space-y-2 py-2 ${disabled ? 'opacity-50' : ''}`}>
      <label 
        htmlFor={inputId} 
        className="text-sm font-medium mb-1 text-center h-12 flex items-center justify-center"
      >
        {label}
      </label>
      
      <div className="relative">
        <label htmlFor={inputId} className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}>
          <Avatar className={`w-24 h-24 border-2 border-dashed ${disabled ? 'border-neutral-300' : (imagePreview || serverImageUrl) ? 'border-primary' : 'border-neutral-400 hover:border-primary/80'} transition-colors`}>
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt={`${label} preview`} className="object-cover" />
            ) : serverImageUrl ? (
              <AvatarImage src={serverImageUrl} alt={`${label} server image`} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-midnight_green/10 flex flex-col items-center justify-center p-2 text-center">
                 <UploadCloud className={`h-8 w-8 ${disabled ? 'text-muted-foreground/50' : 'text-midnight_green'}`} />
                 <span className={`text-[10px] ${disabled ? 'text-muted-foreground/60' : 'text-muted-foreground/90'} mt-1`}>Upload Image</span>
              </AvatarFallback>
            )}
          </Avatar>
        </label>
        
        {(imagePreview || serverImageUrl) && (
          <button 
            onClick={removeImage}
            className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md ${disabled ? 'cursor-not-allowed' : 'hover:bg-red-600'}`}
            type="button"
            title="Clear selection / Use default"
            disabled={disabled}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        
        <input
          id={inputId}
          type="file"
          accept="image/png, image/jpeg, image/gif, image/webp"
          onChange={handleImageChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {imagePreview ? (
         <p className="text-xs text-primary font-medium">Image selected</p>
      ) : (
         !serverImageUrl && <p className="text-xs text-muted-foreground/80">No image selected</p>
      )}

    </div>
  );
};

export default ImageUpload;
