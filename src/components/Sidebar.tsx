import React from 'react';
import { CalendarIcon, ImageIcon, LayoutDashboard, Settings, Upload, Users, Users2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import StatusOutput from './StatusOutput';

type SidebarLinkProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
};

const SidebarLink = ({ icon: Icon, label, to, active }: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all active:scale-98",
      active 
        ? "bg-midnight_green text-mint_green shadow-sm"
        : "text-muted-foreground hover:bg-midnight_green/10 hover:text-midnight_green"
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </Link>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAnalyzed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAnalyzed }) => {
  return (
    <div className="w-64 bg-card text-card-foreground border border-border p-4 flex flex-col shadow-md m-4 rounded-lg">
      <div className="mb-8">
        <h2 className="text-lg font-heading font-semibold text-card-foreground mb-1">Whee poster</h2>
        <p className="text-xs text-muted-foreground">Toastmaster posters 💙</p>
      </div>
      
      <nav className="space-y-6">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">File</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all active:scale-98",
                activeTab === 'upload' 
                  ? "bg-midnight_green text-mint_green shadow-sm"
                  : "text-muted-foreground hover:bg-midnight_green/10 hover:text-midnight_green"
              )}
            >
              <Upload className="h-5 w-5" />
              <span className="font-medium">File Upload</span>
            </button>
          </div>
        </div>
        
        {isAnalyzed && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">Edit</h3>
              <div className="space-y-1">
              <button
                onClick={() => setActiveTab('content')}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all active:scale-98",
                  activeTab === 'content' 
                    ? "bg-midnight_green text-mint_green shadow-sm"
                    : "text-muted-foreground hover:bg-midnight_green/10 hover:text-midnight_green"
                )}
              >
                <LayoutDashboard className="h-5 w-5" /> <span className="font-medium">Content</span>
              </button>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">Manage</h3>
          <div className="space-y-1">
            <SidebarLink 
              to="/profiles" 
              label="User Profiles" 
              icon={Users2}
            />
          </div>
      </div>
      </nav>
      
      <div className="mt-auto">
        <StatusOutput />
      </div>
    </div>
  );
};

export default Sidebar;
