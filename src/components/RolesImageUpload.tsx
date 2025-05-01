import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from './ImageUpload';
import { API_BASE_URL } from '@/services/PresentationService'; // Import base URL if needed here (optional)

interface RolesImageUploadProps {
  onImageSelected: (roleKey: string, file: File | null) => void;
  onServerImageSelect?: (roleKey: string, imageName: string) => void;
  imageFiles: { [key: string]: File | null };
  serverImages: string[];
  disabled?: boolean;
  tmodName: string;
  geName: string;
  speaker1Name: string;
  speaker2Name: string;
  geTitle: string;
}

const roleMapping: { [key: string]: string } = {
    tmod_image: 'TMOD',
    ge_image: 'General Evaluator',
    speaker1_image: 'Speaker 1',
    speaker2_image: 'Speaker 2'
};

const placeholderNames: { [key: string]: string } = {
    tmod_image: 'TMOD_Image_Shape',
    ge_image: 'GE_Image_Shape',
    speaker1_image: 'Speaker1_Image_Shape',
    speaker2_image: 'Speaker2_Image_Shape'
};

const RolesImageUpload: React.FC<RolesImageUploadProps> = ({ 
  onImageSelected, 
  onServerImageSelect,
  imageFiles,
  serverImages,
  disabled = false,
  tmodName,
  geName,
  speaker1Name,
  speaker2Name,
  geTitle
}) => {
  const currentRoleNames: { [key: string]: string } = {
    tmod_image: tmodName,
    ge_image: geName,
    speaker1_image: speaker1Name,
    speaker2_image: speaker2Name
  };

  return (
    <Card className="w-full animate-fade-in bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <CardTitle>Role Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
          {Object.keys(roleMapping).map((roleKey) => {
            let displayTitle = roleMapping[roleKey];
            if (roleKey === 'ge_image') {
              displayTitle = geTitle;
            }

            const selectedFile = imageFiles[roleKey];
            const currentName = currentRoleNames[roleKey];
            
            return (
              <ImageUpload 
                key={roleKey}
                label={displayTitle}
                roleName={currentName}
                roleKey={roleKey}
                onImageSelected={onImageSelected}
                selectedFile={selectedFile}
                disabled={disabled}
                serverImages={serverImages}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesImageUpload;
