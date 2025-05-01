import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useStatus } from '@/contexts/StatusContext';

const StatusOutput: React.FC = () => {
  const { status } = useStatus();

  const isReady = status.toLowerCase().startsWith('ready');
  const isComplete = status.toLowerCase().includes('complete') || status.toLowerCase().includes('successfully');

  const StatusIcon = isReady ? Clock : isComplete ? CheckCircle : AlertCircle;
  const iconColor = isReady ? 'text-blue-400' : isComplete ? 'text-green-400' : 'text-yellow-400';

  return (
    <div className="p-3 border border-border rounded-lg bg-card/50 flex flex-col">
      <div className="flex items-center">
        <StatusIcon className={`h-5 w-5 mr-2 shrink-0 ${iconColor}`} />
        <p className="text-xs font-medium text-foreground flex-1" title={status}>{status}</p>
      </div>
    </div>
  );
};

export default StatusOutput;
