import React, { useState, useEffect, useRef } from 'react';
import presentationService, { Profile, API_BASE_URL } from '@/services/PresentationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Trash2, Upload, UserPlus, RefreshCw } from 'lucide-react';

const ProfilesPage: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [newProfileName, setNewProfileName] = useState<string>('');
    const [newProfileFile, setNewProfileFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const newFileInputRef = useRef<HTMLInputElement>(null); 

    
    const fetchProfiles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await presentationService.getProfiles();
            setProfiles(response.profiles || []);
        } catch (err: any) { 
            setError(err.message || 'Failed to fetch profiles');
            setProfiles([]); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setNewProfileFile(file);
            } else {
                toast.error('Please select an image file.');
                setNewProfileFile(null);
                if (newFileInputRef.current) newFileInputRef.current.value = '';
            }
        } else {
             setNewProfileFile(null);
        }
    };

    const handleAddProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProfileName.trim() || !newProfileFile) {
            toast.error('Please provide a name and select an image file.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            await presentationService.addOrUpdateProfile(newProfileName.trim(), newProfileFile);
            setNewProfileName('');
            setNewProfileFile(null);
            if (newFileInputRef.current) newFileInputRef.current.value = ''; 
            await fetchProfiles(); 
        } catch (err: any) {
            setError(err.message || 'Failed to add profile');
            
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProfile = async (name: string) => {
        if (!window.confirm(`Are you sure you want to delete the profile for "${name}"?`)) {
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await presentationService.deleteProfile(name);
            await fetchProfiles(); 
        } catch (err: any) {
            setError(err.message || 'Failed to delete profile');
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold">Manage User Profiles</h1>

            {/* Add Profile Form */}
            <Card className="bg-card text-card-foreground">
                <CardHeader>
                    <CardTitle>Add New Profile</CardTitle>
                    <CardDescription className="text-muted-foreground">Add a new user name and their profile picture.</CardDescription>
                </CardHeader>
                <form onSubmit={handleAddProfile}>
                    <CardContent className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="profile-name">Name</Label>
                            <Input 
                                id="profile-name"
                                type="text"
                                placeholder="Enter user's full name"
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                required
                                disabled={isLoading}
                                className="placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label>Profile Image</Label>
                            <div className="flex items-center space-x-3">
                            <Input 
                                id="profile-image"
                                type="file"
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                onChange={handleFileChange}
                                    ref={newFileInputRef}
                                required
                                disabled={isLoading}
                                    className="hidden"
                                />
                                <Label 
                                    htmlFor="profile-image"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer border border-midnight_green/30 bg-midnight_green/10 text-midnight_green hover:bg-midnight_green/30 shadow-sm hover:shadow-md"
                                >
                                    <Upload className="mr-2 h-4 w-4" /> 
                                    Choose Image
                                </Label>
                                {newProfileFile ? (
                                  <span className='text-sm text-muted-foreground'>{newProfileFile.name}</span>
                                ) : (
                                  <span className='text-sm text-muted-foreground'>No file selected.</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            type="submit" 
                            disabled={isLoading || !newProfileName.trim() || !newProfileFile}
                            className="bg-midnight_green hover:bg-midnight_green/90"
                        >
                            {isLoading ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <UserPlus className="mr-2 h-4 w-4" />
                            )}
                            Add / Update Profile
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Existing Profiles List */}
            <Card className="bg-card text-card-foreground">
                <CardHeader>
                    <CardTitle>Existing Profiles</CardTitle>
                    <CardDescription className="text-muted-foreground">List of currently saved user profiles.</CardDescription>
                    {error && <p className="text-sm text-destructive mt-2">Error: {error}</p>}
                </CardHeader>
                <CardContent>
                    {isLoading && profiles.length === 0 && <p className="text-muted-foreground">Loading profiles...</p>} 
                    {!isLoading && profiles.length === 0 && !error && <p className="text-muted-foreground">No profiles found.</p>}
                    {profiles.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {profiles.map((profile) => (
                                <Card key={profile.name} className="flex flex-col items-center p-4 bg-background border-border">
                                    <Avatar className="w-20 h-20 mb-3">
                                        <AvatarImage 
                                            src={`${API_BASE_URL}/images/${encodeURIComponent(profile.image_filename)}`} 
                                            alt={`${profile.name}'s profile picture`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-muted text-muted-foreground">
                                          {profile.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-medium text-center mb-1">{profile.name}</p>
                                    <p className="text-xs text-muted-foreground mb-3 break-all">{profile.image_filename}</p>
                                    <Button 
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteProfile(profile.name)}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilesPage; 