
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateInfo {
  day: string;
  date: string;
  month: string;
  year: string;
}

interface DateSelectionProps {
  dateInfo: DateInfo;
  onDateChange: (date: Date) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ dateInfo, onDateChange }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateChange(newDate);
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle>Meeting Date</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="date">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Input id="day" value={dateInfo.day} readOnly className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={dateInfo.date} readOnly className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input id="month" value={dateInfo.month} readOnly className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" value={dateInfo.year} readOnly className="bg-slate-50" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelection;
