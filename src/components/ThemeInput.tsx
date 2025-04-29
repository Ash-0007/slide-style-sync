
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ThemeInputProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeInput: React.FC<ThemeInputProps> = ({ theme, onThemeChange }) => {
  return (
    <Card className="w-full animate-fade-in">
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
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeInput;
