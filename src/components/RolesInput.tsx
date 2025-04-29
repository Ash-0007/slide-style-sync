
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RolesInputProps {
  tmod: string;
  ge: string;
  speaker1: string;
  speaker2: string;
  onRoleChange: (role: string, value: string) => void;
}

const RolesInput: React.FC<RolesInputProps> = ({ 
  tmod, 
  ge, 
  speaker1, 
  speaker2, 
  onRoleChange 
}) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle>Meeting Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tmod">TMOD</Label>
              <Input 
                id="tmod" 
                placeholder="Enter TMOD name" 
                value={tmod} 
                onChange={(e) => onRoleChange('tmod', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ge">General Evaluator</Label>
              <Input 
                id="ge" 
                placeholder="Enter General Evaluator name" 
                value={ge} 
                onChange={(e) => onRoleChange('ge', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="speaker1">Speaker 1</Label>
              <Input 
                id="speaker1" 
                placeholder="Enter Speaker 1 name" 
                value={speaker1} 
                onChange={(e) => onRoleChange('speaker1', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speaker2">Speaker 2</Label>
              <Input 
                id="speaker2" 
                placeholder="Enter Speaker 2 name" 
                value={speaker2} 
                onChange={(e) => onRoleChange('speaker2', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesInput;
