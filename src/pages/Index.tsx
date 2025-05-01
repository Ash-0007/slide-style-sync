import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import DateSelection from '@/components/DateSelection';
import ThemeInput from '@/components/ThemeInput';
import RolesInput from '@/components/RolesInput';
import ActionButtons from '@/components/ActionButtons';
import MeetingDetails from '@/components/MeetingDetails';
import RolesImageUpload from '@/components/RolesImageUpload';
import Sidebar from '@/components/Sidebar';
import presentationService, { BackendAnalysisResult, UpdateRequestData, Profile, PresentationBlob } from '@/services/PresentationService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { format, parse } from 'date-fns';
import { getDateSuffix } from '@/utils/dateUtils';
import UpdateLoadingAnimation from '@/components/UpdateLoadingAnimation';
import { useStatus } from '@/contexts/StatusContext';



const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};


const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Index = () => {
  
  const { status, warnings, setStatus, setWarnings, addWarning, clearStatus } = useStatus();

  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);

  
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const [activeTab, setActiveTab] = useState('upload');
  
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  
  const [theme, setTheme] = useState('');
  const [tmod, setTmod] = useState('');
  const [ge, setGe] = useState('');
  const [speaker1, setSpeaker1] = useState('');
  const [speaker2, setSpeaker2] = useState('');
  
  
  const [geTitle, setGeTitle] = useState<string>("General Evaluator"); 
  
  
  const [profileNames, setProfileNames] = useState<string[]>([]);
  
  
  const [meetingMode, setMeetingMode] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [venue, setVenue] = useState('');
  
  
  const [imageFiles, setImageFiles] = useState<{[key: string]: File | null}>({
    'tmod_image': null,
    'ge_image': null,
    'speaker1_image': null,
    'speaker2_image': null
  });
  
  
  const [serverImages, setServerImages] = useState<string[]>([]);
  
  
  const [updatedBlob, setUpdatedBlob] = useState<PresentationBlob | null>(null);

  

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const [imageResponse, profilesResponse] = await Promise.all([
          presentationService.listImages(),
          presentationService.getProfiles()
        ]);
        setServerImages(imageResponse.images);
        setProfileNames(profilesResponse.profiles.map((p: Profile) => p.name));
      } catch (err) {
        console.error("Failed to fetch initial data (images/profiles):", err);
        setStatus("Error loading initial data. Profiles/images might be unavailable.");
        addWarning("Failed to load initial images or profiles. Autocomplete might not work.");
      }
    };
    fetchData();
  }, []);

  

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    setIsAnalyzed(false);
    setFileId(null);
    setStatus(`File selected: ${file.name}. Click Analyze.`);
    setWarnings([]);
    setError(null);
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
      case 'meetingMode':
        setMeetingMode(value);
        break;
      case 'meetingTime':
        setMeetingTime(value);
        break;
      case 'venue':
        setVenue(value);
        break;
    }
  };
  
  const handleImageSelected = (roleKey: string, file: File | null) => {
    setImageFiles(prev => ({
      ...prev,
      [roleKey]: file
    }));
    if (file) {
      handleImageUpload(roleKey, file);
    }
  };
  
  const handleImageUpload = async (roleKey: string, file: File) => {
    const roleName = roleKey.replace('_image','');
    setStatus(`Uploading image for ${roleName}...`);
    setIsLoading(true);
    try {
      await presentationService.uploadImage(file);
      setStatus(`Image for ${roleName} uploaded successfully.`);
      const response = await presentationService.listImages();
      setServerImages(response.images);
    } catch (err) {
      setStatus(`Failed to upload image for ${roleName}.`);
      addWarning(`Upload failed for ${roleName}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      setStatus('Please select a PowerPoint file first.');
      return;
    }
    
    setIsLoading(true);
    setStatus('Analyzing presentation...');
    setWarnings([]);
    setError(null);
    setFileId(null);

    try {
      const result = await presentationService.analyzePPT(selectedFile);
      
      setFileId(result.fileId);
      setWarnings(result.warnings || []);
      setIsAnalyzed(true);
      
      const initialValues = result.analysisDetails.initial_values;
      if (initialValues) {
        setTheme(initialValues.theme || '');
        setTmod(initialValues.tmod || '');
        setGe(initialValues.ge || '');
        setSpeaker1(initialValues.speaker1 || '');
        setSpeaker2(initialValues.speaker2 || '');
        setMeetingMode(initialValues.meeting_mode || '');
        setMeetingTime(initialValues.meeting_time || '');
        setVenue(initialValues.venue || '');
        
        
        const { day, date, month, year } = initialValues;
        if (day && date && month && year) {
          try {
            
            
            const dateNumStr = date.replace(/(st|nd|rd|th)$/i, '');
            const dateString = `${dateNumStr} ${month} ${year}`;
            
            const parsedDate = parse(dateString, 'd MMMM yyyy', new Date());
            setSelectedDate(parsedDate);
            
            setStatus(`Parsed date from presentation: ${format(parsedDate, "PPP")}`);
          } catch (e) {
            console.error("Failed to parse date from analysis:", e);
            setStatus("Could not automatically parse date. Please select manually.");
            addWarning("Failed to parse date from presentation analysis.");
            setSelectedDate(new Date());
          }
        } else {
           setSelectedDate(new Date());
           setStatus("Date not fully found in presentation. Defaulting to today.");
        }
        
      }

      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => addWarning(warning));
        setStatus(`Analysis complete with ${result.warnings.length} warning(s).`);
      } else {
        setStatus('Analysis complete!');
      }

      setActiveTab('content');
    } catch (error: any) {
      setStatus(`Analysis failed: ${error.message}`);
      addWarning('Failed to analyze presentation. Please check the file or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = async () => {
    if (!fileId) {
      setStatus("Cannot update: File ID is missing. Please analyze again.");
      return;
    }

    if (!selectedDate) {
      setStatus("Meeting date is not selected.");
      setIsLoading(false);
      setIsUpdating(false);
      return;
    }
    
    setIsUpdating(true);
    setIsLoading(true);
    setWarnings([]);
    setUpdatedBlob(null);
    setError(null);

    
    let formattedDate = {
      day: selectedDate ? format(selectedDate, 'EEE').toUpperCase() : '',
      date: selectedDate ? format(selectedDate, 'd') + getDateSuffix(selectedDate.getDate()) : '',
      month: selectedDate ? format(selectedDate, 'MMMM').toUpperCase() : '',
      year: selectedDate ? format(selectedDate, 'yyyy') : '',
    };
    

    const updateData: UpdateRequestData = {
      fileId,
      theme,
      day: formattedDate.day,
      date: formattedDate.date,
      month: formattedDate.month,
      year: formattedDate.year,
      tmod,
      ge,
      speaker1,
      speaker2,
      meetingMode: meetingMode,
      meetingTime: meetingTime,
      venue,
      
      ge_title: geTitle,
      
      
    };

    try {
      const blob: PresentationBlob = await presentationService.updatePresentation(updateData);
      setUpdatedBlob(blob);
      setStatus("Presentation updated. Ready to save.");
    } catch (error: any) {
      setStatus(`Update failed: ${error.message}`);
      addWarning("Failed to update presentation. Please check details or try again.");
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  };

  const handleSaveClick = () => {
    if (!updatedBlob) {
      setStatus("No updated presentation available to save. Please update first.");
      return;
    }
    if (!fileName) {
      addWarning("Original filename not found, using default: updated_presentation.pptx");
      setStatus("Saving presentation (using default filename)...")
    } else {
      let downloadFilename = updatedBlob.filename || fileName?.replace(/\.pptx$/i, '_updated.pptx') || "updated_presentation.pptx";
      setStatus("Saving presentation...");

      try {
        presentationService.saveBlob(updatedBlob, downloadFilename);
        setStatus(`Presentation saved as ${downloadFilename}.`);
      } catch (error: any) {
        setStatus(`Save failed: ${error.message}`);
        addWarning("Failed to save the presentation file.");
      }
    }
  };
  
  return (
    <div className="flex h-screen relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAnalyzed={isAnalyzed} />
      <div className="flex-1 flex flex-col p-3 overflow-y-auto">
        {/* Progress Indicator Header */}
        {/* Revert heading to default foreground color */}
        {/* Reduce margin-bottom on the title */}
        <h2 className="text-2xl font-semibold mb-2">
          {activeTab === 'upload' ? 'Step 1: Upload & Analyze Presentation' : 'Step 2: Edit Content Details'}
        </h2>
        
        {/* Main Content Area (Always rendered now) */}
        <motion.div
          className="flex-1 flex flex-col gap-4"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* --- Upload Tab Content --- */}
          {activeTab === 'upload' && (
            <div className="mb-6">
              <FileUpload 
                onFileSelected={handleFileSelected} 
                onAnalyzeClick={handleAnalyzeClick} 
                fileName={fileName} 
                isLoading={isLoading} 
              />
            </div>
          )}

          {/* --- Content Tab Content --- */}
          {activeTab === 'content' && (
            <>
              {/* Remove margin-bottom from this grid container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-1">
                  <DateSelection date={selectedDate} onDateChange={setSelectedDate} />
                </div>
                <div className="col-span-1">
                  <ThemeInput theme={theme} onThemeChange={setTheme} />
                </div>
                <div className="col-span-1 md:col-span-2">
          <RolesInput
            tmod={tmod}
            ge={ge}
            speaker1={speaker1}
            speaker2={speaker2}
            onRoleChange={handleRoleChange}
            profileNames={profileNames}
                    disabled={isLoading} 
                    
                    geTitle={geTitle}
                    onGeTitleChange={setGeTitle} 
          />
                </div>
              </div>

              {/* Keep margin on subsequent wrappers */}
              <div className="mb-4">
          <MeetingDetails
            meetingMode={meetingMode}
            meetingTime={meetingTime}
            venue={venue}
            onDetailChange={handleDetailChange}
                  disabled={isLoading}
          />
              </div>
              <div className="mb-4">
          <RolesImageUpload
                  tmodName={tmod}
                  geName={ge}
                  speaker1Name={speaker1}
                  speaker2Name={speaker2}
                  geTitle={geTitle}
            imageFiles={imageFiles}
            onImageSelected={handleImageSelected}
            serverImages={serverImages}
                  disabled={isLoading}
                />
              </div>
            </>
          )}
          
          {/* --- Common Components --- */}
          {/* Reduce margin-bottom */}
          <div className="mb-4">
            <ActionButtons
              onUpdate={handleUpdateClick}
              onSave={handleSaveClick}
              isDisabled={!isAnalyzed || isLoading || isUpdating || activeTab !== 'content'}
            />
          </div>

        </motion.div>
      </div>

      {/* Loading Overlay */} 
      <AnimatePresence>
        {isUpdating && (
          <motion.div
            
            className="absolute inset-0 bg-[hsl(var(--background)/0.7)] backdrop-blur-sm flex items-center justify-center z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <UpdateLoadingAnimation />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Index;
