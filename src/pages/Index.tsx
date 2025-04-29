
import React, { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import DateSelection from '@/components/DateSelection';
import ThemeInput from '@/components/ThemeInput';
import RolesInput from '@/components/RolesInput';
import StatusOutput from '@/components/StatusOutput';
import ActionButtons from '@/components/ActionButtons';
import { formatDateInfo } from '@/utils/dateUtils';
import PresentationService from '@/services/PresentationService';
import { toast } from 'sonner';

const Index = () => {
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  
  // Date state
  const [dateInfo, setDateInfo] = useState(formatDateInfo(new Date()));
  
  // Form state
  const [theme, setTheme] = useState('');
  const [tmod, setTmod] = useState('');
  const [ge, setGe] = useState('');
  const [speaker1, setSpeaker1] = useState('');
  const [speaker2, setSpeaker2] = useState('');
  
  // Status and logs
  const [status, setStatus] = useState('Ready to start');
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setIsAnalyzed(false);
    setStatus(`File selected: ${file.name}`);
    setLogs([]);
  };
  
  const handleDateChange = (date: Date) => {
    setDateInfo(formatDateInfo(date));
  };
  
  const handleRoleChange = (role: string, value: string) => {
    switch (role) {
      case 'tmod':
        setTmod(value);
        break;
      case 'ge':
        setGe(value);
        break;
      case 'speaker1':
        setSpeaker1(value);
        break;
      case 'speaker2':
        setSpeaker2(value);
        break;
    }
  };
  
  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      toast.error('Please select a PowerPoint file first');
      return;
    }
    
    setStatus('Analyzing presentation...');
    setLogs([]);
    
    try {
      const result = await PresentationService.analyzePPT(selectedFile);
      
      setLogs(result.logs);
      setStatus(`Presentation analyzed. Found ${result.logs.length} text elements to replace.`);
      setIsAnalyzed(true);
      
      // Set the field values based on analysis
      if (result.searchTexts.theme) setTheme(result.searchTexts.theme);
      if (result.searchTexts.tmod && result.searchTexts.tmod.startsWith('TM ')) {
        setTmod(result.searchTexts.tmod.substring(3));
      }
      if (result.searchTexts.ge) setGe(result.searchTexts.ge);
      if (result.searchTexts.speaker1 && result.searchTexts.speaker1.startsWith('TM ')) {
        setSpeaker1(result.searchTexts.speaker1.substring(3));
      }
      if (result.searchTexts.speaker2 && result.searchTexts.speaker2.startsWith('TM ')) {
        setSpeaker2(result.searchTexts.speaker2.substring(3));
      }
      
      toast.success('Presentation analyzed successfully');
    } catch (error) {
      console.error('Error analyzing presentation:', error);
      setStatus('Error analyzing presentation');
      toast.error('Failed to analyze presentation');
    }
  };
  
  const handleUpdatePresentation = async () => {
    if (!selectedFile || !isAnalyzed) {
      toast.error('Please select and analyze a PowerPoint file first');
      return;
    }
    
    setStatus('Updating presentation...');
    
    try {
      const updateLogs = await PresentationService.updatePresentation({
        theme,
        day: dateInfo.day,
        date: dateInfo.date,
        month: dateInfo.month,
        year: dateInfo.year,
        tmod,
        ge,
        speaker1,
        speaker2
      });
      
      setLogs(updateLogs);
      setStatus('Presentation updated. Click "Save As..." to save the changes.');
      toast.success('Presentation updated successfully');
    } catch (error) {
      console.error('Error updating presentation:', error);
      setStatus('Error updating presentation');
      toast.error('Failed to update presentation');
    }
  };
  
  const handleSavePresentation = () => {
    if (!selectedFile || !isAnalyzed) {
      toast.error('Please select and analyze a PowerPoint file first');
      return;
    }
    
    try {
      PresentationService.savePresentation(selectedFile.name);
      setStatus(`Presentation saved as ${selectedFile.name.replace('.pptx', '')}_edited.pptx`);
    } catch (error) {
      console.error('Error saving presentation:', error);
      setStatus('Error saving presentation');
      toast.error('Failed to save presentation');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="purple-gradient py-10">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
            Slide Style Sync
          </h1>
          <p className="text-center text-white/90 text-lg mb-6">
            Update your PowerPoint presentations with ease
          </p>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FileUpload 
              onFileSelected={handleFileSelected}
              onAnalyzeClick={handleAnalyzeClick}
              fileName={selectedFile?.name || null}
            />
            
            <DateSelection 
              dateInfo={dateInfo}
              onDateChange={handleDateChange}
            />
            
            <ThemeInput 
              theme={theme}
              onThemeChange={setTheme}
            />
          </div>
          
          <div className="space-y-6">
            <RolesInput 
              tmod={tmod}
              ge={ge}
              speaker1={speaker1}
              speaker2={speaker2}
              onRoleChange={handleRoleChange}
            />
            
            <StatusOutput 
              status={status}
              logs={logs}
            />
            
            <ActionButtons 
              onUpdate={handleUpdatePresentation}
              onSave={handleSavePresentation}
              isDisabled={!isAnalyzed}
            />
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="container">
          <p className="text-center text-sm text-slate-500">
            Slide Style Sync © {new Date().getFullYear()} - PowerPoint presentation editor
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
