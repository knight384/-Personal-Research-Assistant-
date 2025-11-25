import React, { useState } from 'react';
<<<<<<< HEAD
import { Folder, ViewState, User } from '../types';
import { Icons } from './Icons';
import { GlassCard } from './GlassCard';
import { authService } from '../services/auth';

interface SidebarProps {
  folders: Folder[];
=======
import { Folder, ViewState, User, Paper } from '../types';
import { Icons } from './Icons';
import { GlassCard } from './GlassCard';

interface SidebarProps {
  folders: Folder[];
  papers: Paper[]; // Added papers to calculate counts
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
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
<<<<<<< HEAD
=======
  papers,
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
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

<<<<<<< HEAD
=======
  const getPaperCount = (folderId: string) => {
    if (folderId === 'all') return papers.length; // Logic if we had an 'all' folder
    return papers.filter(p => p.folderId === folderId).length;
  };

  const activeFolder = folders.find(f => f.id === activeFolderId);

>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
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

<<<<<<< HEAD
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

=======
          {folders.map(folder => {
            const count = getPaperCount(folder.id);
            const isActive = activeFolderId === folder.id && currentView === ViewState.LIBRARY;
            return (
              <button
                key={folder.id}
                onClick={() => {
                  onSelectFolder(folder.id);
                  onNavigate(ViewState.LIBRARY);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all group ${
                  isActive
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icons.FolderOpen size={16} className={isActive ? 'text-yellow-400' : 'text-slate-500 group-hover:text-slate-400'} />
                  <span className="truncate">{folder.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {folder.synthesis && (
                    <Icons.Sparkles size={10} className="text-blue-400 animate-pulse" />
                  )}
                  {count > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                       isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                    }`}>
                      {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Folder Insights Panel */}
        {activeFolder?.synthesis && currentView === ViewState.LIBRARY && (
           <div className="mx-4 mb-4 mt-2 animate-fade-in-up">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-white/10 backdrop-blur-md shadow-lg">
                <div className="flex items-center space-x-2 text-blue-300 mb-2">
                  <Icons.Lightbulb size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Folder Insights</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed font-light">
                  {activeFolder.synthesis.replace(/^#+\s/g, '').split('\n')[0]}...
                </p>
                <div className="mt-2 text-[10px] text-blue-400/80 italic">
                  Analysis based on {getPaperCount(activeFolder.id)} papers
                </div>
              </div>
           </div>
        )}

>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
        <div className="p-4 border-t border-white/10">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
<<<<<<< HEAD
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
=======
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate w-24">{user.name}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
<<<<<<< HEAD
                className="text-slate-400 hover:text-red-400 transition-colors"
=======
                className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5"
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
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