
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MeetingDetailsProps {
  meetingMode: string;
  meetingTime: string;
  venue: string;
  onDetailChange: (field: string, value: string) => void;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ 
  meetingMode, 
  meetingTime, 
  venue, 
  onDetailChange 
}) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle>Meeting Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-mode">Meeting Mode</Label>
            <Input 
              id="meeting-mode" 
              placeholder="Online or In-Person" 
              value={meetingMode} 
              onChange={(e) => onDetailChange('meeting_mode', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-time">Meeting Time</Label>
            <Input 
              id="meeting-time" 
              placeholder="e.g. 7:00 PM - 9:00 PM" 
              value={meetingTime} 
              onChange={(e) => onDetailChange('meeting_time', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input 
              id="venue" 
              placeholder="Location" 
              value={venue} 
              onChange={(e) => onDetailChange('venue', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingDetails;
