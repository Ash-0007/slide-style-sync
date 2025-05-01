import { toast } from "sonner";



export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';




export interface BackendAnalysisResult {
  fileName: string;
  analysisDetails: {
    text_content_found?: any; 
    image_placeholders_found?: { [key: string]: { slide_idx: number; shape_id: number } | null };
    text_placeholders_found?: { [key: string]: { slide_idx: number; shape_id: number; current_text: string } | null };
    initial_values: {
        theme: string;
        tmod: string;
        ge: string;
        speaker1: string;
        speaker2: string;
        meeting_mode: string;
        meeting_time: string;
        venue: string;
        day: string;
        date: string;
        month: string;
        year: string;
    };
    
  };
  status: string;
  warnings?: string[];
  fileId: string; 
}


export interface UpdateRequestData {
  fileId: string;
  theme: string;
  day: string;
  date: string;
  month: string;
  year: string;
  tmod: string;
  ge: string;
  speaker1: string;
  speaker2: string;
  meetingMode: string; 
  meetingTime: string; 
  venue: string;
  
  tmodImage?: string;    
  geImage?: string;      
  speaker1Image?: string; 
  speaker2Image?: string; 
  
  ge_title: string; 
}


export interface ImageListResponse {
  images: string[];
}


export interface PresentationBlob extends Blob {
    filename?: string;
}


async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
        console.log(`Calling API: ${options.method || 'GET'} ${url}`);
        const response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
            },
        });

        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            let errorBody = '';
            try {
                
                errorBody = await response.text(); 
                const errorJson = JSON.parse(errorBody); 
                errorDetail = errorJson.detail || errorDetail;
            } catch (e) {
                 errorDetail = `${errorDetail} - ${errorBody || 'No response body'}`;
                
            }
            console.error(`API Error (${options.method || 'GET'} ${endpoint}): ${errorDetail}`, response);
            toast.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        return response;
    } catch (error: any) {
        
        if (error.message.startsWith('HTTP error!')) {
             throw error; 
        } else {
            
            console.error(`Network or other error calling ${endpoint}:`, error);
            toast.error(`Network Error: Could not connect to API at ${url}. Is the backend running?`);
            throw new Error(`Network Error: Could not connect to API.`); 
        }
    }
}


interface ShapeInfo {
  slideIdx: number;
  shapeIdx: number;
  currentText: string;
}


export interface Profile {
    name: string;
    image_filename: string;
}

export interface ProfileListResponse {
    profiles: Profile[];
}

export interface ProfileUpdateResponse {
    message: string;
    profile: Profile;
}

export interface ProfileDeleteResponse {
    message: string;
    name: string;
}

class PresentationService {
  

  async analyzePPT(file: File): Promise<BackendAnalysisResult> {
    console.log(`Analyzing PPT: ${file.name}`);
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetchApi("/upload_analyze/", {
            method: "POST",
            body: formData,
            
        });
        const data: BackendAnalysisResult = await response.json();
        console.log("Analysis successful:", data);
        if (!data.fileId) {
            throw new Error("Analysis response missing fileId");
        }
        return data;
    } catch (error) {
        console.error(`Failed to analyze presentation '${file.name}'.`, error);
        throw error;
    }
  }

  async updatePresentation(updateData: UpdateRequestData): Promise<PresentationBlob> {
     console.log("Updating presentation for fileId:", updateData.fileId);
     if (!updateData.fileId) {
        const errorMsg = "Update failed: Missing fileId.";
        console.error(errorMsg);
        throw new Error(errorMsg);
     }
     try {
        const response = await fetchApi("/update_presentation/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                
                
                "Accept": "application/vnd.openxmlformats-officedocument.presentationml.presentation, application/json",
            },
            body: JSON.stringify(updateData),
        });

        
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            const errorJson = await response.json();
            const errorMsg = `Update failed: ${errorJson.detail || 'Unknown server error'}`;
            console.error(errorMsg, errorJson);
            throw new Error(errorMsg);
        }

        
        const blob: PresentationBlob = await response.blob();

        
        const disposition = response.headers.get('Content-Disposition');
        let filename = "updated_presentation.pptx"; 
        if (disposition && disposition.includes('attachment')) {
            const filenameRegex = /filename[^;=]*=(?:"(.*?)"|([^;]*))/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && (matches[1] || matches[2])) {
              filename = matches[1] || matches[2]; 
              
              filename = filename.split(/[/\\]/).pop() || "download.pptx";
            }
        }

        console.log(`Update successful. Received blob: ${blob.size} bytes, type: ${blob.type}. Filename: ${filename}`);
        blob.filename = filename;

        return blob;
     } catch (error) {
         console.error("Error during presentation update:", error);
         throw error;
     }
  }

  async uploadImage(file: File): Promise<{ message: string }> {
    console.log(`Uploading image: ${file.name}`);
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetchApi("/upload_image/", {
            method: "POST",
            body: formData,
            headers: {
                 "Accept": "application/json", 
            }
        });
        const data = await response.json();
        console.log("Image upload successful:", data);
        return data;
    } catch (error) {
        console.error(`Failed to upload image '${file.name}'.`, error);
        throw error;
    }
  }

  async listImages(): Promise<ImageListResponse> {
    console.log("Listing server images");
    try {
        const response = await fetchApi("/list_images/", {
             method: "GET",
             headers: {
                 "Accept": "application/json", 
             }
        });
        const data: ImageListResponse = await response.json();
        console.log("Found images:", data.images);
        return data;
    } catch (error) {
        toast.error("Failed to list server images.");
        throw error; 
    }
  }

  
  
  saveBlob(blob: PresentationBlob | Blob | null, defaultFileName: string = "presentation.pptx"): void {
    if (!(blob instanceof Blob)) {
        console.error("Invalid blob provided to saveBlob", blob);
        toast.error("Download failed: Invalid file data.");
      return;
    }
    
    const filename = (blob as PresentationBlob).filename || defaultFileName;
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    console.log(`Triggered download for ${filename}`);
  }

  async getProfiles(): Promise<ProfileListResponse> {
    console.log("Fetching profiles");
    try {
        const response = await fetchApi("/profiles/", {
             method: "GET",
             headers: { "Accept": "application/json" }
        });
        const data: ProfileListResponse = await response.json();
        console.log("Profiles fetched:", data.profiles);
        return data;
    } catch (error) {
        toast.error("Failed to fetch profiles.");
        throw error;
    }
  }

  async addOrUpdateProfile(name: string, file: File): Promise<ProfileUpdateResponse> {
    console.log(`Adding/updating profile for: ${name}`);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    try {
        const response = await fetchApi("/profiles/", {
            method: "POST",
            body: formData, 
            headers: { "Accept": "application/json" } 
        });
        const data: ProfileUpdateResponse = await response.json();
        console.log("Profile update successful:", data);
        toast.success(data.message || `Profile for '${name}' saved.`);
        return data;
    } catch (error) {
        toast.error(`Failed to save profile for '${name}'.`);
        throw error;
    }
  }

  async deleteProfile(name: string): Promise<ProfileDeleteResponse> {
    console.log(`Deleting profile: ${name}`);
    try {
        
        const encodedName = encodeURIComponent(name);
        const response = await fetchApi(`/profiles/${encodedName}`, {
            method: "DELETE",
            headers: { "Accept": "application/json" } 
        });
        const data: ProfileDeleteResponse = await response.json();
        console.log("Profile deletion successful:", data);
        toast.success(data.message || `Profile for '${name}' deleted.`);
        return data;
    } catch (error) {
        toast.error(`Failed to delete profile for '${name}'.`);
        throw error;
    }
  }
}


const presentationService = new PresentationService();
export default presentationService;














export interface ImagePlaceholderInfo {
  slideIdx: number;
  shapeId: number; 
}

export interface TextPlaceholderInfo {
  slideIdx: number;
  shapeId: number; 
  currentText: string;
}
