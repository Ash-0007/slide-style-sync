import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RolesInputProps {
  tmod: string;
  ge: string;
  speaker1: string;
  speaker2: string;
  onRoleChange: (role: string, value: string) => void;
  disabled?: boolean;
  profileNames?: string[];
  geTitle: string;
  onGeTitleChange: (value: string) => void;
}

interface RoleComboboxProps {
  roleKey: 'tmod' | 'ge' | 'speaker1' | 'speaker2';
  roleLabel: string;
  value: string;
  suggestions: string[];
  onValueChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const RoleCombobox: React.FC<RoleComboboxProps> = ({ 
  roleKey,
  roleLabel,
  value,
  suggestions,
  onValueChange,
  placeholder,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={roleKey}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          {value
            ? suggestions.find((name) => name.toLowerCase() === value.toLowerCase()) || value
            : <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command shouldFilter={true}>
          <CommandInput placeholder={`Search ${roleLabel}...`} />
          <CommandList className="dark">
            <CommandEmpty>No profile found.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((name) => (
                <CommandItem
                  key={name}
                  value={name}
                  onSelect={(currentValue) => {
                    const newValue = currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue;
                    onValueChange(newValue);
                    setOpen(false);
                  }}
                  className={cn(
                    "text-midnight_green",
                    "data-[highlighted]:bg-midnight_green data-[highlighted]:text-mint_green",
                    "data-[selected=true]:bg-midnight_green data-[selected=true]:text-mint_green"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === name.toLowerCase() ? "opacity-100" : "opacity-0",
                      "data-[selected=true]:text-mint_green data-[highlighted]:text-mint_green"
                    )}
                  />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const RolesInput: React.FC<RolesInputProps> = ({ 
  tmod, 
  ge, 
  speaker1, 
  speaker2, 
  onRoleChange,
  disabled = false,
  profileNames = [],
  geTitle,
  onGeTitleChange
}) => {
  const gePlaceholder = geTitle === "Speaker 3" ? "Select Speaker 3 Name..." : "Select GE Name...";

  const buttonBaseStyle = "relative px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors z-10";
  const buttonInactiveStyle = "text-muted-foreground hover:text-accent-foreground";
  const buttonActiveStyle = "text-primary-foreground";

  return (
    <Card className="w-full animate-fade-in bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <CardTitle>Meeting Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tmod">TMOD</Label>
              <RoleCombobox 
                roleKey="tmod"
                roleLabel="TMOD"
                value={tmod}
                suggestions={profileNames}
                onValueChange={(val) => onRoleChange('tmod', val)}
                placeholder="Select TMOD..."
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="relative flex items-center space-x-2 p-0.5 border border-input rounded-md h-6">
                <motion.div
                  layoutId="ge-title-highlight"
                  className="absolute inset-y-0 bg-midnight_green rounded-[5px] z-0"
                  initial={false}
                  animate={{
                    left: geTitle === "General Evaluator" ? "2px" : "50%",
                    width: geTitle === "General Evaluator" ? "calc(50% - 4px)" : "calc(50% - 4px)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                
                <button
                  type="button"
                  onClick={() => !disabled && onGeTitleChange("General Evaluator")}
                  disabled={disabled}
                  className={cn(
                    buttonBaseStyle,
                    "w-1/2 text-center",
                    geTitle === "General Evaluator" ? buttonActiveStyle : buttonInactiveStyle
                  )}
                >
                  General Evaluator
                </button>
                <button
                  type="button"
                  onClick={() => !disabled && onGeTitleChange("Speaker 3")}
                  disabled={disabled}
                  className={cn(
                    buttonBaseStyle,
                    "w-1/2 text-center",
                    geTitle === "Speaker 3" ? buttonActiveStyle : buttonInactiveStyle
                  )}
                >
                  Speaker 3
                </button>
              </div>
              <RoleCombobox 
                roleKey="ge"
                roleLabel={geTitle}
                value={ge}
                suggestions={profileNames}
                onValueChange={(val) => onRoleChange('ge', val)}
                placeholder={gePlaceholder}
                disabled={disabled}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="speaker1">Speaker 1</Label>
              <RoleCombobox 
                roleKey="speaker1"
                roleLabel="Speaker 1"
                value={speaker1}
                suggestions={profileNames}
                onValueChange={(val) => onRoleChange('speaker1', val)}
                placeholder="Select Speaker 1..."
                disabled={disabled}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="speaker2">Speaker 2</Label>
              <RoleCombobox 
                roleKey="speaker2"
                roleLabel="Speaker 2"
                value={speaker2}
                suggestions={profileNames}
                onValueChange={(val) => onRoleChange('speaker2', val)}
                placeholder="Select Speaker 2..."
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesInput;
