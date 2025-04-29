
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from './ImageUpload';
import { Separator } from "@/components/ui/separator";

interface RolesImageUploadProps {
  onImageSelected: (role: string, file: File | null) => void;
  tmod: string;
  ge: string;
  speaker1: string;
  speaker2: string;
}

const RolesImageUpload: React.FC<RolesImageUploadProps> = ({ 
  onImageSelected, 
  tmod, 
  ge, 
  speaker1, 
  speaker2 
}) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle>Profile Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ImageUpload 
            label="TMOD Image"
            roleTitle={tmod || "TMOD"} 
            roleName="tmod"
            onImageSelected={onImageSelected}
          />
          
          <ImageUpload 
            label="GE Image"
            roleTitle={ge || "General Evaluator"}  
            roleName="ge"
            onImageSelected={onImageSelected}
          />
          
          <ImageUpload 
            label="Speaker 1 Image"
            roleTitle={speaker1 || "Speaker 1"}  
            roleName="speaker1"
            onImageSelected={onImageSelected}
          />
          
          <ImageUpload 
            label="Speaker 2 Image"
            roleTitle={speaker2 || "Speaker 2"}  
            roleName="speaker2"
            onImageSelected={onImageSelected}
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-xs text-muted-foreground">
          <p>Images will be applied to placeholders with the matching names in your PowerPoint:</p>
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li>TMOD_Image_Shape</li>
            <li>GE_Image_Shape</li>
            <li>Speaker1_Image_Shape</li>
            <li>Speaker2_Image_Shape</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesImageUpload;
