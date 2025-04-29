
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";

interface ActionButtonsProps {
  onUpdate: () => void;
  onSave: () => void;
  isDisabled: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onUpdate, onSave, isDisabled }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
      <Button 
        onClick={onUpdate} 
        disabled={isDisabled}
        className="flex-1 bg-purple hover:bg-purple-dark"
      >
        <Edit className="mr-2 h-4 w-4" />
        Update Presentation
      </Button>
      
      <Button 
        onClick={onSave} 
        disabled={isDisabled}
        variant="outline" 
        className="flex-1 border-purple text-purple hover:bg-purple-light/10"
      >
        <Download className="mr-2 h-4 w-4" />
        Save As...
      </Button>
    </div>
  );
};

export default ActionButtons;
