
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from './ui/button';

interface StatusOutputProps {
  status: string;
  logs: string[];
}

const StatusOutput: React.FC<StatusOutputProps> = ({ status, logs }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusIcon = () => {
    if (status.toLowerCase().includes('error')) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else if (status.toLowerCase().includes('success') || status.toLowerCase().includes('updated')) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <Info className="h-5 w-5 text-deep-purple" />;
    }
  };

  return (
    <Card className="w-full animate-fade-in bg-white shadow-card">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-deep-purple font-heading">Status</CardTitle>
        {logs.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0 rounded-full"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex items-center gap-3">
            {getStatusIcon()}
            <p className="text-sm text-neutral-800">{status}</p>
          </div>
          
          {logs.length > 0 && expanded && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium">Debug Logs</p>
                <span className="bg-neutral-200 text-neutral-700 px-2 py-0.5 text-xs rounded-full">
                  {logs.length}
                </span>
              </div>
              <ScrollArea className="h-[200px] rounded-md border border-neutral-200">
                <div className="p-3 text-xs font-mono bg-neutral-50">
                  {logs.map((log, index) => (
                    <div key={index} className="py-1 border-b border-neutral-100 last:border-b-0">
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusOutput;
