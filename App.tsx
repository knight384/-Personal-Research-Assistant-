import React, { useState, useEffect } from 'react';
import { ViewState, Folder, Paper, GroundingSource, User } from './types';
import { Sidebar } from './components/Sidebar';
import { ResearchView } from './components/ResearchView';
import { LibraryView } from './components/LibraryView';
import { DocumentDetail } from './components/DocumentDetail';
import { AuthView } from './components/AuthView';
import { Icons } from './components/Icons';
import { authService } from './services/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [view, setView] = useState<ViewState>(ViewState.RESEARCH);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data State
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'default', name: 'General' },
    { id: 'quantum', name: 'Quantum Physics' },
    { id: 'ml', name: 'Machine Learning' }
  ]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Handlers
  const handleAddPaper = (source: GroundingSource) => {
    const newPaper: Paper = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      folderId: activeFolderId || 'default',
      title: source.title,
      url: source.uri,
      userNotes: '',
      addedAt: new Date()
    };
    setPapers(prev => [newPaper, ...prev]);
  };

  const handleUpdatePaper = (updated: Paper) => {
    setPapers(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeletePaper = (id: string) => {
    setPapers(prev => prev.filter(p => p.id !== id));
    if (selectedPaperId === id) setSelectedPaperId(null);
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const selectedPaper = papers.find(p => p.id === selectedPaperId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <span className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthView onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-200">
      
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/10"
        >
          <Icons.Menu size={20} />
        </button>
      </div>

      <Sidebar 
        folders={folders}
        activeFolderId={activeFolderId}
        currentView={view}
        onNavigate={(v) => {
          setView(v);
          setSelectedPaperId(null); // Close document when navigating
          setIsSidebarOpen(false);
        }}
        onSelectFolder={setActiveFolderId}
        onCreateFolder={handleCreateFolder}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden transition-all duration-300">
        
        {/* Main Content Render */}
        {view === ViewState.RESEARCH && (
          <ResearchView 
            onAddPaper={handleAddPaper} 
            savedUrls={new Set(papers.map(p => p.url))}
          />
        )}

        {view === ViewState.LIBRARY && (
          <LibraryView 
            papers={papers}
            folders={folders}
            activeFolderId={activeFolderId}
            onSelectPaper={(p) => setSelectedPaperId(p.id)}
            onMovePaper={(pId, fId) => {
              const p = papers.find(x => x.id === pId);
              if (p) handleUpdatePaper({ ...p, folderId: fId });
            }}
            onDeletePaper={handleDeletePaper}
          />
        )}

        {/* Overlay Document Detail */}
        {selectedPaper && (
          <DocumentDetail 
            paper={selectedPaper}
            onClose={() => setSelectedPaperId(null)}
            onUpdatePaper={handleUpdatePaper}
          />
        )}

      </main>
    </div>
  );
}

export default App;