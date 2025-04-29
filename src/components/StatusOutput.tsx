
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StatusOutputProps {
  status: string;
  logs: string[];
}

const StatusOutput: React.FC<StatusOutputProps> = ({ status, logs }) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-sm">{status}</p>
          </div>
          
          {logs.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Debug Logs:</p>
              <ScrollArea className="h-[120px] rounded-md border">
                <div className="p-3 text-xs font-mono bg-slate-50">
                  {logs.map((log, index) => (
                    <div key={index} className="py-1">
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
