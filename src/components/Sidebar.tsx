
import React from 'react';
import { CalendarIcon, ImageIcon, LayoutDashboard, Settings, Upload, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarLinkProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
};

const SidebarLink = ({ icon: Icon, label, active, onClick }: SidebarLinkProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all",
      active 
        ? "bg-deep-purple text-white" 
        : "text-neutral-700 hover:bg-neutral-100"
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </button>
);

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAnalyzed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isAnalyzed }) => {
  return (
    <div className="w-64 bg-white border-r border-neutral-200 h-screen p-4">
      <div className="mb-8">
        <h2 className="text-lg font-heading font-semibold text-deep-purple mb-1">Slide Style Sync</h2>
        <p className="text-xs text-neutral-500">Presentation Editor</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 px-3">File</h3>
          <div className="space-y-1">
            <SidebarLink 
              icon={Upload} 
              label="File Upload" 
              active={activeTab === 'upload'}
              onClick={() => onTabChange('upload')}
            />
          </div>
        </div>
        
        {isAnalyzed && (
          <>
            <div>
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 px-3">Edit</h3>
              <div className="space-y-1">
                <SidebarLink 
                  icon={LayoutDashboard} 
                  label="Content" 
                  active={activeTab === 'content'}
                  onClick={() => onTabChange('content')}
                />
                <SidebarLink 
                  icon={Settings} 
                  label="Meeting Details" 
                  active={activeTab === 'details'} 
                  onClick={() => onTabChange('details')}
                />
                <SidebarLink 
                  icon={ImageIcon} 
                  label="Profile Images" 
                  active={activeTab === 'images'}
                  onClick={() => onTabChange('images')}
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-500 mb-2">Tips</p>
          <p className="text-xs text-neutral-700">Use the sidebar to navigate between different sections of the presentation editor.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
