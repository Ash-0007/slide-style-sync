
import { toast } from "sonner";

interface ShapeInfo {
  slideIdx: number;
  shapeIdx: number;
  currentText: string;
}

interface ShapeObjects {
  [key: string]: ShapeInfo[];
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
  
  async analyzePPT(file: File): Promise<{ logs: string[], searchTexts: { [key: string]: string } }> {
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
      
      const logs: string[] = [];
      
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
      
      // Simulate a delay for analysis
      setTimeout(() => {
        resolve({
          logs,
          searchTexts: this.searchTexts
        });
      }, 1000);
    });
  }
  
  async updatePresentation(replacements: Replacements): Promise<string[]> {
    return new Promise((resolve) => {
      // In a real implementation, we would update the PPT file here
      // For demo purposes, we're simulating the update
      
      // Format replacements with TM prefix for speakers
      const formattedReplacements = {
        ...replacements,
        tmod: `TM ${replacements.tmod}`,
        speaker1: `TM ${replacements.speaker1}`,
        speaker2: `TM ${replacements.speaker2}`
      };
      
      const logs: string[] = [];
      
      // Simulate updating each shape
      Object.keys(this.shapeObjects).forEach(key => {
        this.shapeObjects[key].forEach(shapeInfo => {
          const newText = formattedReplacements[key as keyof Replacements];
          logs.push(`Updated '${key}' on slide ${shapeInfo.slideIdx+1} from '${shapeInfo.currentText}' to '${newText}'`);
          
          // Update the current text in our data structure
          shapeInfo.currentText = newText;
        });
      });
      
      // Simulate creating a temp presentation
      this.tempPresentationBlob = this.presentationBlob;
      
      // Simulate a delay for processing
      setTimeout(() => {
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
