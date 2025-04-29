
import { toast } from "sonner";

interface ShapeInfo {
  slideIdx: number;
  shapeIdx: number;
  currentText: string;
}

interface ShapeObjects {
  [key: string]: ShapeInfo[];
}

interface ImagePlaceholder {
  slideIdx: number;
  shapeIdx: number;
}

interface TextPlaceholder {
  slideIdx: number;
  shapeIdx: number;
  currentText: string;
}

interface Replacements {
  theme: string;
  day: string;
  date: string;
  month: string;
  year: string;
  tmod: string;
  ge: string;
  speaker1: string;
  speaker2: string;
  meeting_mode: string;
  meeting_time: string;
  venue: string;
}

class PresentationService {
  // Simulating the shape objects and search texts that would be found in a PPT
  private shapeObjects: ShapeObjects = {};
  private searchTexts: { [key: string]: string } = {
    'theme': 'Speak friend and enter',
    'day': 'WED',
    'date': '30th',
    'month': 'APRIL',
    'year': '2025',
    'tmod': 'TM TMOD NAME',
    'ge': 'GE Name',
    'speaker1': 'TM Person1',
    'speaker2': 'TM Person2'
  };

  private presentationBlob: Blob | null = null;
  private tempPresentationBlob: Blob | null = null;
  
  // Image and text placeholder info
  private imageShapeNames: { [key: string]: string } = {
    'tmod_image': 'TMOD_Image_Shape',
    'speaker1_image': 'Speaker1_Image_Shape',
    'speaker2_image': 'Speaker2_Image_Shape',
    'ge_image': 'GE_Image_Shape'
  };

  private textShapeNames: { [key: string]: string } = {
    'meeting_mode': 'Meeting Mode',
    'meeting_time': 'Meeting Time',
    'venue': 'Venue'
  };
  
  private imagePlaceholders: { [key: string]: ImagePlaceholder | null } = {};
  private textPlaceholders: { [key: string]: TextPlaceholder | null } = {};
  
  async analyzePPT(file: File): Promise<{ 
    logs: string[], 
    searchTexts: { [key: string]: string },
    textDetails: { 
      meeting_mode?: string,
      meeting_time?: string,
      venue?: string
    }
  }> {
    return new Promise((resolve) => {
      // In a real implementation, we would analyze the PPT file here
      // For demo purposes, we're simulating the analysis
      
      this.presentationBlob = file;
      
      // Reset shape objects
      this.shapeObjects = {
        'theme': [],
        'day': [],
        'date': [],
        'month': [],
        'year': [],
        'tmod': [],
        'ge': [],
        'speaker1': [],
        'speaker2': []
      };
      
      // Reset placeholder objects
      this.imagePlaceholders = {
        'tmod_image': null,
        'speaker1_image': null,
        'speaker2_image': null,
        'ge_image': null
      };
      
      this.textPlaceholders = {
        'meeting_mode': null,
        'meeting_time': null,
        'venue': null
      };
      
      const logs: string[] = [];
      const textDetails: { meeting_mode?: string, meeting_time?: string, venue?: string } = {
        meeting_mode: 'Online Meeting',
        meeting_time: '7:00 PM - 9:00 PM',
        venue: 'Zoom Video Conference'
      };
      
      // Simulate finding text in slides
      Object.keys(this.searchTexts).forEach(key => {
        const slideIdx = Math.floor(Math.random() * 5); // Random slide index
        const shapeIdx = Math.floor(Math.random() * 10); // Random shape index
        
        this.shapeObjects[key].push({
          slideIdx,
          shapeIdx,
          currentText: this.searchTexts[key]
        });
        
        logs.push(`Found potential match for '${key}': '${this.searchTexts[key]}' on slide ${slideIdx+1}`);
      });
      
      // Simulate finding image placeholders
      Object.keys(this.imageShapeNames).forEach(key => {
        const slideIdx = Math.floor(Math.random() * 5); // Random slide index
        const shapeIdx = Math.floor(Math.random() * 10); // Random shape index
        
        this.imagePlaceholders[key] = {
          slideIdx,
          shapeIdx
        };
        
        logs.push(`Found image placeholder for '${key}': Shape named '${this.imageShapeNames[key]}' on slide ${slideIdx+1}`);
      });
      
      // Simulate finding text placeholders
      Object.keys(this.textShapeNames).forEach(key => {
        const slideIdx = Math.floor(Math.random() * 5); // Random slide index
        const shapeIdx = Math.floor(Math.random() * 10); // Random shape index
        const currentText = textDetails[key as keyof typeof textDetails] || '';
        
        this.textPlaceholders[key] = {
          slideIdx,
          shapeIdx,
          currentText
        };
        
        logs.push(`Found text placeholder for '${key}': Shape named '${this.textShapeNames[key]}' with text '${currentText}' on slide ${slideIdx+1}`);
      });
      
      // Simulate a delay for analysis
      setTimeout(() => {
        resolve({
          logs,
          searchTexts: this.searchTexts,
          textDetails
        });
      }, 1000);
    });
  }
  
  async updatePresentation(replacements: Replacements, imageFiles: { [key: string]: File | null }): Promise<string[]> {
    return new Promise((resolve) => {
      // In a real implementation, we would update the PPT file here
      // For demo purposes, we're simulating the update
      
      if (!this.presentationBlob) {
        toast.error("No presentation file available. Please upload and analyze a presentation first.");
        return resolve([]);
      }
      
      // Format replacements with TM prefix for speakers
      const formattedReplacements = {
        ...replacements,
        tmod: `TM ${replacements.tmod}`,
        speaker1: `TM ${replacements.speaker1}`,
        speaker2: `TM ${replacements.speaker2}`
      };
      
      const logs: string[] = [];
      
      // Simulate updating each shape text
      Object.keys(this.shapeObjects).forEach(key => {
        if (key in formattedReplacements) {
          this.shapeObjects[key].forEach(shapeInfo => {
            const newText = formattedReplacements[key as keyof typeof formattedReplacements];
            logs.push(`Updated '${key}' text on slide ${shapeInfo.slideIdx+1} from '${shapeInfo.currentText}' to '${newText}'`);
            
            // Update the current text in our data structure
            shapeInfo.currentText = newText;
          });
        }
      });
      
      // Simulate updating text placeholders
      Object.keys(this.textPlaceholders).forEach(key => {
        if (this.textPlaceholders[key] && key in formattedReplacements) {
          const placeholder = this.textPlaceholders[key];
          const newText = formattedReplacements[key as keyof typeof formattedReplacements];
          
          if (placeholder) {
            logs.push(`Updated text placeholder '${key}' on slide ${placeholder.slideIdx+1} from '${placeholder.currentText}' to '${newText}'`);
            placeholder.currentText = newText;
          }
        }
      });
      
      // Simulate updating images
      Object.keys(imageFiles).forEach(key => {
        const imageFile = imageFiles[key];
        if (imageFile) {
          const roleName = key.replace('_image', '');
          const personName = replacements[roleName as keyof typeof replacements];
          
          const placeholder = this.imagePlaceholders[key];
          if (placeholder) {
            logs.push(`Updated image for '${roleName}' (${personName}) on slide ${placeholder.slideIdx+1} with file: ${imageFile.name}`);
          }
        }
      });
      
      // Update the searchTexts with the new values
      Object.keys(formattedReplacements).forEach(key => {
        if (key in this.searchTexts) {
          this.searchTexts[key] = formattedReplacements[key as keyof typeof formattedReplacements];
        }
      });
      
      // Create a copy of the original blob to simulate an update
      this.tempPresentationBlob = new Blob([this.presentationBlob], { type: this.presentationBlob.type });
      
      // Simulate a delay for processing
      setTimeout(() => {
        toast.success("Presentation updated successfully!");
        resolve(logs);
      }, 1500);
    });
  }
  
  savePresentation(fileName: string): void {
    if (!this.tempPresentationBlob) {
      toast.error("No updated presentation available. Please update the presentation first.");
      return;
    }
    
    // Create a download link for the presentation
    const url = URL.createObjectURL(this.tempPresentationBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace('.pptx', '') + "_edited.pptx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Presentation saved successfully!");
  }
}

export default new PresentationService();
