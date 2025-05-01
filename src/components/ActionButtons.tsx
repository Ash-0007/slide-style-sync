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
        className="flex-1 bg-midnight_green hover:bg-midnight_green-700 text-mint_green shadow-button hover:shadow-button-hover transition-all disabled:bg-muted disabled:text-muted-foreground"
      >
        <ArrowUpCircle className="mr-2 h-5 w-5" />
        Update Presentation
      </Button>
      
      <Button 
        onClick={onSave} 
        disabled={isDisabled}
        variant="outline" 
        className="flex-1 border-midnight_green text-midnight_green hover:bg-midnight_green/10 shadow-sm hover:shadow-button transition-all disabled:border-muted disabled:text-muted-foreground disabled:hover:bg-transparent"
      >
        <Download className="mr-2 h-5 w-5" />
        Save...
      </Button>
    </div>
  );
};

export default ActionButtons;
