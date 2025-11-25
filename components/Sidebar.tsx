import React, { useState } from 'react';
import { Folder, ViewState, User } from '../types';
import { Icons } from './Icons';
import { GlassCard } from './GlassCard';
import { authService } from '../services/auth';

interface SidebarProps {
  folders: Folder[];
  activeFolderId: string | null;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onSelectFolder: (id: string | null) => void;
  onCreateFolder: (name: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  user: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  activeFolderId,
  currentView,
  onNavigate,
  onSelectFolder,
  onCreateFolder,
  isOpen,
  onToggle,
  user,
  onLogout
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  const NavItem = ({ 
    view, 
    label, 
    icon: Icon, 
    isActive 
  }: { 
    view: ViewState, 
    label: string, 
    icon: any, 
    isActive: boolean 
  }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' 
          : 'hover:bg-white/5 text-slate-400 hover:text-slate-100'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />

      {/* Sidebar Panel */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/10 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <Icons.Sparkles className="text-blue-400" />
            <span className="text-xl font-bold tracking-tight">Lumina</span>
          </div>
          <button onClick={onToggle} className="lg:hidden text-slate-400">
            <Icons.X />
          </button>
        </div>

        <div className="px-4 space-y-2">
          <NavItem 
            view={ViewState.RESEARCH} 
            label="Research" 
            icon={Icons.Search} 
            isActive={currentView === ViewState.RESEARCH} 
          />
          <NavItem 
            view={ViewState.LIBRARY} 
            label="Library" 
            icon={Icons.Library} 
            isActive={currentView === ViewState.LIBRARY && activeFolderId === null} 
          />
        </div>

        <div className="mt-8 px-6 mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Folders</span>
          <button 
            onClick={() => setIsCreating(true)}
            className="hover:text-blue-400 transition-colors"
          >
            <Icons.Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {isCreating && (
            <GlassCard className="p-2 mb-2">
              <form onSubmit={handleCreateSubmit}>
                <input
                  type="text"
                  autoFocus
                  placeholder="Folder Name"
                  className="w-full bg-transparent border-b border-white/20 px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-400"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={() => !newFolderName && setIsCreating(false)}
                />
              </form>
            </GlassCard>
          )}

          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => {
                onSelectFolder(folder.id);
                onNavigate(ViewState.LIBRARY);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                activeFolderId === folder.id && currentView === ViewState.LIBRARY
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icons.FolderOpen size={16} className={activeFolderId === folder.id ? 'text-yellow-400' : 'text-slate-500'} />
              <span className="truncate">{folder.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate w-24">{user.name}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Log Out"
              >
                <Icons.LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 text-center">
              Guest Mode
            </div>
          )}
        </div>
      </aside>
    </>
  );
};