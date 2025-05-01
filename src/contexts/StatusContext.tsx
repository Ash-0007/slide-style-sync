import React, { createContext, useState, useContext, ReactNode } from 'react';

interface StatusContextType {
  status: string;
  warnings: string[];
  setStatus: (status: string) => void;
  setWarnings: (warnings: string[]) => void;
  addWarning: (warning: string) => void;
  clearStatus: () => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<string>('Ready.');
  const [warnings, setWarnings] = useState<string[]>([]);

  const addWarning = (warning: string) => {
    setWarnings(prev => [...prev, warning]);
  };

  const clearStatus = () => {
    setStatus('Ready.');
    setWarnings([]);
  };

  return (
    <StatusContext.Provider value={{ status, warnings, setStatus, setWarnings, addWarning, clearStatus }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = (): StatusContextType => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
}; 