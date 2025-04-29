
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ArrowUpCircle } from "lucide-react";

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
        className="flex-1 bg-gradient-primary hover:bg-deep-purple/90 text-white shadow-button hover:shadow-button-hover transition-all"
      >
        <ArrowUpCircle className="mr-2 h-5 w-5" />
        Update Presentation
      </Button>
      
      <Button 
        onClick={onSave} 
        disabled={isDisabled}
        variant="outline" 
        className="flex-1 border-deep-purple text-deep-purple hover:bg-deep-purple/10 shadow-sm hover:shadow-button transition-all"
      >
        <Download className="mr-2 h-5 w-5" />
        Save As...
      </Button>
    </div>
  );
};

export default ActionButtons;
