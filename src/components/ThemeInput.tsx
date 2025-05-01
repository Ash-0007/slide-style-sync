import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ThemeInputProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  disabled?: boolean;
}

const ThemeInput: React.FC<ThemeInputProps> = ({ theme, onThemeChange, disabled = false }) => {
  return (
    <Card className="w-full animate-fade-in bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <CardTitle>Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="theme">Meeting Theme</Label>
          <Input 
            id="theme" 
            placeholder="Enter meeting theme" 
            value={theme} 
            onChange={(e) => onThemeChange(e.target.value)}
            disabled={disabled}
            className="placeholder:text-muted-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeInput;
