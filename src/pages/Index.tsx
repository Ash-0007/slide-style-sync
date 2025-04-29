
import React, { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import DateSelection from '@/components/DateSelection';
import ThemeInput from '@/components/ThemeInput';
import RolesInput from '@/components/RolesInput';
import StatusOutput from '@/components/StatusOutput';
import ActionButtons from '@/components/ActionButtons';
import MeetingDetails from '@/components/MeetingDetails';
import RolesImageUpload from '@/components/RolesImageUpload';
import Sidebar from '@/components/Sidebar';
import { formatDateInfo } from '@/utils/dateUtils';
import PresentationService from '@/services/PresentationService';
import { toast } from 'sonner';

const Index = () => {
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('upload');
  
  // Date state
  const [dateInfo, setDateInfo] = useState(formatDateInfo(new Date()));
  
  // Form state
  const [theme, setTheme] = useState('');
  const [tmod, setTmod] = useState('');
  const [ge, setGe] = useState('');
  const [speaker1, setSpeaker1] = useState('');
  const [speaker2, setSpeaker2] = useState('');
  
  // Meeting details state
  const [meetingMode, setMeetingMode] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [venue, setVenue] = useState('');
  
  // Images state
  const [imageFiles, setImageFiles] = useState<{[key: string]: File | null}>({
    'tmod_image': null,
    'ge_image': null,
    'speaker1_image': null,
    'speaker2_image': null
  });
  
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
  
  const handleDetailChange = (field: string, value: string) => {
    switch (field) {
      case 'meeting_mode':
        setMeetingMode(value);
        break;
      case 'meeting_time':
        setMeetingTime(value);
        break;
      case 'venue':
        setVenue(value);
        break;
    }
  };
  
  const handleImageSelected = (role: string, file: File | null) => {
    setImageFiles(prev => ({
      ...prev,
      [role]: file
    }));
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
      setStatus(`Presentation analyzed. Found ${result.logs.length} elements to replace.`);
      setIsAnalyzed(true);
      
      // Set the field values based on analysis
      if (result.searchTexts.theme) setTheme(result.searchTexts.theme);
      if (result.searchTexts.tmod && result.searchTexts.tmod.startsWith('TM ')) {
        setTmod(result.searchTexts.tmod.substring(3));
      }
      if (result.searchTexts.ge) {
        setGe(result.searchTexts.ge.startsWith('TM ') ? 
              result.searchTexts.ge.substring(3) : 
              result.searchTexts.ge);
      }
      if (result.searchTexts.speaker1) {
        setSpeaker1(result.searchTexts.speaker1.startsWith('TM ') ? 
                  result.searchTexts.speaker1.substring(3) : 
                  result.searchTexts.speaker1);
      }
      if (result.searchTexts.speaker2) {
        setSpeaker2(result.searchTexts.speaker2.startsWith('TM ') ? 
                  result.searchTexts.speaker2.substring(3) : 
                  result.searchTexts.speaker2);
      }
      
      // Set meeting details
      if (result.textDetails) {
        if (result.textDetails.meeting_mode) setMeetingMode(result.textDetails.meeting_mode);
        if (result.textDetails.meeting_time) setMeetingTime(result.textDetails.meeting_time);
        if (result.textDetails.venue) setVenue(result.textDetails.venue);
      }
      
      // Switch to content tab after successful analysis
      setActiveTab('content');
      
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
      const updateLogs = await PresentationService.updatePresentation(
        {
          theme,
          day: dateInfo.day,
          date: dateInfo.date,
          month: dateInfo.month,
          year: dateInfo.year,
          tmod,
          ge,
          speaker1,
          speaker2,
          meeting_mode: meetingMode,
          meeting_time: meetingTime,
          venue: venue
        },
        imageFiles
      );
      
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

  const renderContent = () => {
    if (activeTab === 'upload' || !isAnalyzed) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FileUpload 
            onFileSelected={handleFileSelected}
            onAnalyzeClick={handleAnalyzeClick}
            fileName={selectedFile?.name || null}
          />
          <StatusOutput 
            status={status}
            logs={logs}
          />
        </div>
      );
    } else if (activeTab === 'content') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
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
          </div>
        </div>
      );
    } else if (activeTab === 'details') {
      return (
        <div className="space-y-6">
          <MeetingDetails 
            meetingMode={meetingMode}
            meetingTime={meetingTime}
            venue={venue}
            onDetailChange={handleDetailChange}
          />
          <StatusOutput 
            status={status}
            logs={logs}
          />
        </div>
      );
    } else if (activeTab === 'images') {
      return (
        <div className="space-y-6">
          <RolesImageUpload 
            onImageSelected={handleImageSelected}
            tmod={tmod}
            ge={ge}
            speaker1={speaker1}
            speaker2={speaker2}
          />
          <StatusOutput 
            status={status}
            logs={logs}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isAnalyzed={isAnalyzed} 
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-primary py-6">
          <div className="container px-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-1 font-heading">
              Slide Style Sync
            </h1>
            <p className="text-center text-white/80 text-base">
              PowerPoint Presentation Editor
            </p>
          </div>
        </div>
        
        <div className="container py-8 px-6 flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-800 font-heading mb-2">
              {activeTab === 'upload' ? 'File Upload' : 
               activeTab === 'content' ? 'Content Editor' : 
               activeTab === 'details' ? 'Meeting Details' : 'Profile Images'}
            </h2>
            <p className="text-neutral-500">
              {activeTab === 'upload' ? 'Upload your PowerPoint file to get started' : 
               activeTab === 'content' ? 'Edit the date, theme, and roles in your presentation' : 
               activeTab === 'details' ? 'Update meeting mode, time, and venue information' : 'Add profile pictures for each role'}
            </p>
          </div>
          
          {renderContent()}
          
          {isAnalyzed && (
            <div className="mt-8">
              <ActionButtons 
                onUpdate={handleUpdatePresentation}
                onSave={handleSavePresentation}
                isDisabled={false}
              />
            </div>
          )}
        </div>
        
        <footer className="bg-white border-t border-neutral-200 py-4">
          <div className="container px-6">
            <p className="text-center text-sm text-neutral-500">
              Slide Style Sync © {new Date().getFullYear()} - PowerPoint presentation editor
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
