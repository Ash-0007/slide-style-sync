import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format, addMinutes, setHours, setMinutes, startOfDay, parse } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

interface MeetingDetailsProps {
  meetingMode: string;
  meetingTime: string; 
  venue: string;
  onDetailChange: (field: string, value: string) => void;
  disabled?: boolean;
}

const generateTimeSlots = (startHour: number, endHour: number, intervalMinutes: number): string[] => {
  const slots: string[] = [];
  let currentTime = setMinutes(setHours(startOfDay(new Date()), startHour), 0);
  const endTime = setMinutes(setHours(startOfDay(new Date()), endHour), 0);

  while (currentTime <= endTime) {
    slots.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, intervalMinutes);
  }
  return slots;
};

const timeSlots = generateTimeSlots(17, 21, 30);

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ 
  meetingMode, 
  meetingTime, 
  venue, 
  onDetailChange,
  disabled = false
}) => {
  
  const parseStartTime = (timeStr: string): string => {
    if (!timeStr) return timeSlots[0]; 
    const parts = timeStr.split(' - ');
    if (parts.length > 0) {
      try {
        const dateWithStartTime = parse(parts[0], 'h:mma', new Date());
        return format(dateWithStartTime, 'HH:mm');
      } catch (e) {
        console.warn(`Could not parse start time from "${timeStr}", defaulting.`);
      }
    }
    return timeSlots[0]; 
  };

  const [selectedStartTime, setSelectedStartTime] = useState<string>(() => parseStartTime(meetingTime));
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [hoverTimeIndex, setHoverTimeIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedStartTime) return;

    try {
        const [hours, minutes] = selectedStartTime.split(':').map(Number);
        const startTimeDate = setMinutes(setHours(startOfDay(new Date()), hours), minutes);
        const endTimeDate = addMinutes(startTimeDate, 90);
        const formattedString = `${format(startTimeDate, 'h:mma')} - ${format(endTimeDate, 'h:mma')}`;
        
        if (formattedString !== meetingTime) {
            onDetailChange('meetingTime', formattedString);
        }
    } catch (e) {
        console.error("Error formatting meeting time:", e);
        
        if (meetingTime !== "") { 
           onDetailChange('meetingTime', ''); 
        }
    }
  }, [selectedStartTime, onDetailChange, meetingTime]);

  useEffect(() => {
    setSelectedStartTime(parseStartTime(meetingTime));
  }, [meetingTime]);

  // Determine text color based on both selection and hover state
  const getTextColor = (buttonMode: string) => {
    // If hovering or selected, use the active text color
    if (hoveredMode === buttonMode || (!hoveredMode && meetingMode === buttonMode)) {
      return "text-mint_green";
    }
    // Otherwise use the inactive color
    return "text-raisin_black";
  };
  
  const modeButtonBaseStyle = "relative px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition-colors flex-1 text-center z-10"; 

  // Get display format of time in 12-hour format
  const formatDisplayTime = (timeStr: string) => {
    try {
      return format(parse(timeStr, 'HH:mm', new Date()), 'h:mm a');
    } catch (e) {
      return timeStr;
    }
  };

  // Calculate end time from start time
  const getEndTime = (startTimeStr: string) => {
    try {
      const [hours, minutes] = startTimeStr.split(':').map(Number);
      const startTimeDate = setMinutes(setHours(startOfDay(new Date()), hours), minutes);
      const endTimeDate = addMinutes(startTimeDate, 90);
      return format(endTimeDate, 'h:mm a');
    } catch (e) {
      return "";
    }
  };

  return (
    <Card className="w-full animate-fade-in bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <CardTitle>Meeting Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Meeting Mode Selector */}
          <div className="space-y-2">
            <Label>Meeting Mode</Label>
            {/* Container with relative positioning and mouse leave handler */}
            <div 
              className="relative flex items-center space-x-0 border border-input rounded-md p-0.5 h-9" 
              onMouseLeave={() => setHoveredMode(null)} 
            > 
              {/* Animated Highlight */}
              <motion.div
                 layoutId="meeting-mode-highlight" 
                 className="absolute inset-y-0 bg-midnight_green rounded-[5px] z-0" 
                 initial={false}
                 animate={{
                     left: hoveredMode === 'Online' ? '2px' : (hoveredMode === 'Offline' ? '50%' : (meetingMode === 'Online' ? '2px' : '50%')),
                     width: 'calc(50% - 2px)' 
                 }}
                 transition={{ type: "spring", stiffness: 350, damping: 35 }} 
              />
              {/* Online Button */}
              <button
                type="button"
                onClick={() => !disabled && onDetailChange('meetingMode', 'Online')}
                onMouseEnter={() => !disabled && setHoveredMode('Online')} 
                disabled={disabled}
                className={cn(
                  modeButtonBaseStyle,
                  "rounded-r-none",
                  getTextColor('Online') // Dynamic text color
                )}
              >
                Online
              </button>
              {/* Offline Button */}
              <button
                type="button"
                onClick={() => !disabled && onDetailChange('meetingMode', 'Offline')}
                onMouseEnter={() => !disabled && setHoveredMode('Offline')} 
                disabled={disabled}
                className={cn(
                  modeButtonBaseStyle,
                  "rounded-l-none",
                  getTextColor('Offline') // Dynamic text color
                )}
              >
                Offline
              </button>
            </div>
          </div>

          {/* Animated Time Selector */}
          <div className="space-y-2 relative">
            <Label htmlFor="meeting-start-time"> Time </Label>
            
            {/* Time Selector Button */}
            <button
              id="meeting-start-time"
              onClick={() => !disabled && setIsTimePickerOpen(!isTimePickerOpen)}
              disabled={disabled}
              className="relative w-full h-9 px-3 flex items-center justify-between rounded-md border border-input bg-transparent ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-left"
            >
              <div className="flex items-center space-x-2">
                <span>
                  {selectedStartTime ? formatDisplayTime(selectedStartTime) : "Select time"}
                </span>
                {selectedStartTime && (
                  <span className="text-muted-foreground">
                    - {getEndTime(selectedStartTime)}
                  </span>
                )}
              </div>
              <Clock className="h-4 w-4 opacity-70" />
            </button>
            
            {/* Animated Time Picker */}
            <AnimatePresence>
              {isTimePickerOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md overflow-hidden"
                >
                  <div className="max-h-60 overflow-auto py-1 px-1">
                    <div className="grid grid-cols-2 gap-1">
                      {timeSlots.map((time, index) => {
                        const isActive = time === selectedStartTime;
                        const endTime = getEndTime(time);
                        const isHovered = index === hoverTimeIndex;
                        
                        return (
                          <motion.button
                            key={time}
                            onClick={() => {
                              setSelectedStartTime(time);
                              setIsTimePickerOpen(false);
                            }}
                            onMouseEnter={() => setHoverTimeIndex(index)}
                            onMouseLeave={() => setHoverTimeIndex(null)}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              "relative px-3 py-2 text-sm rounded-md transition-all duration-200 overflow-hidden",
                              isActive ? "text-white" : "text-foreground hover:text-white"
                            )}
                          >
                            {/* Background gradient */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-midnight_green to-teal-600 rounded-md opacity-0"
                              animate={{ 
                                opacity: isActive ? 1 : isHovered ? 0.8 : 0 
                              }}
                              transition={{ duration: 0.2 }}
                            />
                            
                            <div className="relative z-10 flex flex-col">
                              <span className="font-medium">{formatDisplayTime(time)}</span>
                              <span className="text-xs opacity-80">to {endTime}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Display calculated time range */}
            {meetingTime && !isTimePickerOpen && (
              <p className="text-xs text-muted-foreground pt-1">
                Meeting duration: 1.5 hours
              </p>
            )}
          </div>

          {/* Venue Input */}
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input 
              id="venue" 
              placeholder="Location or Link" 
              value={venue} 
              onChange={(e) => onDetailChange('venue', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingDetails;