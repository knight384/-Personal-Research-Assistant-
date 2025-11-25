import React, { useState, useEffect } from 'react';
import { Paper, Folder } from '../types';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';
import { citationService } from '../services/citation';
import { synthesizeFolder } from '../services/gemini';

interface LibraryViewProps {
  papers: Paper[];
  folders: Folder[];
  activeFolderId: string | null;
  onSelectPaper: (paper: Paper) => void;
  onMovePaper: (paperId: string, folderId: string) => void;
  onDeletePaper: (paperId: string) => void;
  onUpdateFolderSynthesis: (folderId: string, synthesis: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ 
  papers, 
  folders, 
  activeFolderId,
  onSelectPaper,
  onMovePaper,
  onDeletePaper,
  onUpdateFolderSynthesis
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  
  // Main Export Menu State
  const [showMainExportMenu, setShowMainExportMenu] = useState(false);
  const [exportSource, setExportSource] = useState<string>('current'); // 'current', 'all', or folderId

  // Synthesis Loading State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const filteredPapers = activeFolderId 
    ? papers.filter(p => p.folderId === activeFolderId)
    : papers;

  const activeFolder = activeFolderId ? folders.find(f => f.id === activeFolderId) : null;
  const currentFolderName = activeFolder ? activeFolder.name : 'All Documents';

  // Count papers with summaries
  const analyzedCount = filteredPapers.filter(p => p.summary).length;
  const canSynthesize = activeFolderId && analyzedCount > 1;

  const loadingMessages = [
    "Reading document summaries...",
    "Identifying common themes...",
    "Connecting key findings...",
    "Drafting insights...",
    "Finalizing synthesis..."
  ];

  // Auto-trigger Synthesis Effect
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (activeFolderId && !activeFolder?.synthesis && analyzedCount >= 2 && !isSynthesizing) {
       // Wait 1.5s to ensure user is staying on the folder before starting expensive AI op
       timeout = setTimeout(() => {
           // console.log("Auto-starting synthesis...");
           handleSynthesize();
       }, 1500); 
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [activeFolderId, activeFolder?.synthesis, analyzedCount]); // Removed isSynthesizing from deps to avoid loop/race

  const handleSynthesize = async () => {
    if (!activeFolderId || !canSynthesize) return;
    
    setIsSynthesizing(true);
    setProgress(0);
    setLoadingMessage(loadingMessages[0]);
    
    // Simulate progress and message cycling
    const msgInterval = setInterval(() => {
      setLoadingMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 800);

    try {
      // Filter only analyzed papers
      const analyzedPapers = filteredPapers.filter(p => p.summary);
      
      const result = await synthesizeFolder(analyzedPapers, currentFolderName);
      
      // Complete animations
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      setProgress(100);
      setLoadingMessage("Complete!");
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 600));
      
      onUpdateFolderSynthesis(activeFolderId, result);
    } catch (error) {
      console.error(error);
      setLoadingMessage("Error occurred");
    } finally {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      setIsSynthesizing(false);
      setProgress(0);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // Export selected items
  const handleExportSelected = (format: 'bibtex' | 'apa') => {
    const papersToExport = papers.filter(p => selectedIds.has(p.id));
    if (papersToExport.length === 0) return;
    
    const content = format === 'bibtex' 
      ? citationService.generateBibTeX(papersToExport)
      : citationService.generateAPA(papersToExport);
      
    citationService.downloadCitation(content, format);
    setShowExportMenu(false);
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  // Bulk Export Logic
  const handleBulkExport = (format: 'bibtex' | 'apa') => {
    let papersToExport: Paper[] = [];

    if (exportSource === 'current') {
      papersToExport = filteredPapers;
    } else if (exportSource === 'all') {
      papersToExport = papers;
    } else {
      // Specific folder
      papersToExport = papers.filter(p => p.folderId === exportSource);
    }

    if (papersToExport.length === 0) {
      alert("No papers found in selected source.");
      return;
    }

    const content = format === 'bibtex' 
      ? citationService.generateBibTeX(papersToExport)
      : citationService.generateAPA(papersToExport);
      
    citationService.downloadCitation(content, format);
    setShowMainExportMenu(false);
  };

  const handleBatchMove = (targetFolderId: string) => {
    selectedIds.forEach(id => {
      onMovePaper(id, targetFolderId);
    });
    setShowMoveMenu(false);
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  return (
    <div className="p-6 lg:p-10 h-full overflow-y-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{currentFolderName}</h1>
          <p className="text-slate-400">
            {filteredPapers.length} {filteredPapers.length === 1 ? 'document' : 'documents'} collected
            {analyzedCount > 0 && ` • ${analyzedCount} analyzed`}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isSelectionMode ? (
            <>
               <span className="text-sm text-slate-400">{selectedIds.size} selected</span>
               
               {/* Move Menu */}
               <div className="relative">
                 <button
                   onClick={() => setShowMoveMenu(!showMoveMenu)}
                   disabled={selectedIds.size === 0}
                   className="bg-white/10 border border-white/10 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-white/20 disabled:opacity-50"
                 >
                   <Icons.FolderOpen size={16} />
                   <span className="hidden sm:inline">Move to...</span>
                 </button>
                 {showMoveMenu && (
                   <div className="absolute top-full right-0 mt-2 w-48 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                     <div className="max-h-60 overflow-y-auto">
                       <button
                         onClick={() => handleBatchMove('default')}
                         className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white truncate"
                       >
                         General / Default
                       </button>
                       {folders.filter(f => f.id !== 'default').map(folder => (
                         <button
                           key={folder.id}
                           onClick={() => handleBatchMove(folder.id)}
                           className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white truncate"
                         >
                           {folder.name}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               {/* Export Selected Menu */}
               <div className="relative">
                 <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={selectedIds.size === 0}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-blue-500 disabled:opacity-50"
                 >
                   <Icons.Quote size={16} />
                   <span className="hidden sm:inline">Export</span>
                 </button>
                 {showExportMenu && (
                   <div className="absolute top-full right-0 mt-2 w-32 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                     <button 
                       onClick={() => handleExportSelected('bibtex')}
                       className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white"
                     >
                       BibTeX
                     </button>
                     <button 
                       onClick={() => handleExportSelected('apa')}
                       className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white"
                     >
                       APA
                     </button>
                   </div>
                 )}
               </div>
               
               <button 
                 onClick={() => {
                   setIsSelectionMode(false);
                   setSelectedIds(new Set());
                 }}
                 className="bg-white/10 text-slate-300 px-3 py-2 rounded-lg text-sm hover:bg-white/20"
               >
                 Cancel
               </button>
            </>
          ) : (
            <>
              {/* Main Export Menu (Bulk) */}
              <div className="relative">
                <button 
                  onClick={() => setShowMainExportMenu(!showMainExportMenu)}
                  className="bg-white/5 border border-white/10 text-slate-300 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-white/10"
                >
                  <Icons.Quote size={16} />
                  <span>Export</span>
                </button>
                {showMainExportMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20 p-2">
                    <div className="mb-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 px-1">Source</label>
                      <select 
                        value={exportSource}
                        onChange={(e) => setExportSource(e.target.value)}
                        className="w-full bg-black/20 text-slate-200 text-sm border border-white/10 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
                      >
                        <option value="current">Current View ({filteredPapers.length})</option>
                        <option value="all">All Documents ({papers.length})</option>
                        <optgroup label="Specific Folders">
                          <option value="default">General / Default</option>
                          {folders.filter(f => f.id !== 'default').map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleBulkExport('bibtex')}
                        className="flex-1 bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 py-1.5 rounded text-xs font-medium transition-colors border border-white/5"
                      >
                        BibTeX
                      </button>
                      <button 
                         onClick={() => handleBulkExport('apa')}
                         className="flex-1 bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 py-1.5 rounded text-xs font-medium transition-colors border border-white/5"
                       >
                         APA
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsSelectionMode(true)}
                disabled={filteredPapers.length === 0}
                className="bg-white/5 border border-white/10 text-slate-300 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-white/10 disabled:opacity-50"
              >
                <Icons.CheckSquare size={16} />
                <span>Select</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Folder Synthesis Section */}
      {activeFolder && (
        <div className="mb-8">
           {activeFolder.synthesis ? (
             <div className="animate-fade-in-up">
                <GlassCard className="p-6 border-blue-500/20 bg-blue-900/10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-blue-200 flex items-center space-x-2">
                      <Icons.Sparkles size={18} />
                      <span>Collection Insights</span>
                    </h2>
                    <button 
                      onClick={handleSynthesize}
                      disabled={isSynthesizing}
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <Icons.Bot size={12} />
                      <span>{isSynthesizing ? 'Updating...' : 'Refresh Analysis'}</span>
                    </button>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                    <div className="whitespace-pre-wrap">{activeFolder.synthesis}</div>
                  </div>
                </GlassCard>
             </div>
           ) : (
             canSynthesize && (
               <div className="animate-fade-in">
                 <GlassCard className={`p-0 overflow-hidden border-dashed border-white/20 transition-all duration-500 ${isSynthesizing ? 'bg-blue-500/5 border-blue-500/30' : ''}`}>
                   {isSynthesizing ? (
                      <div className="p-6 flex flex-col items-center justify-center space-y-4">
                         {/* Progress Bar Container */}
                         <div className="w-full max-w-md bg-white/5 rounded-full h-2 overflow-hidden">
                           <div 
                             className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-all duration-300 ease-out"
                             style={{ width: `${progress}%` }}
                           />
                         </div>
                         
                         <div className="flex items-center space-x-3 text-blue-200">
                           <Icons.Sparkles className="animate-pulse" size={18} />
                           <span className="text-sm font-medium animate-pulse">{loadingMessage}</span>
                         </div>
                      </div>
                   ) : (
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-slate-300">
                          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <Icons.Bot size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Generate Collection Insights</p>
                            <p className="text-xs text-slate-500">Synthesize themes across your {analyzedCount} analyzed papers.</p>
                          </div>
                        </div>
                        <button 
                          onClick={handleSynthesize}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 shadow-lg shadow-purple-900/20"
                        >
                          <Icons.Sparkles size={16} />
                          <span>Synthesize</span>
                        </button>
                      </div>
                   )}
                 </GlassCard>
               </div>
             )
           )}
        </div>
      )}

      {filteredPapers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
          <Icons.BookOpen size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No documents here yet.</p>
          <p className="text-sm">Start researching to add sources.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPapers.map(paper => (
            <GlassCard 
              key={paper.id} 
              className={`
                flex flex-col h-64 group relative overflow-hidden transition-all duration-300
                ${selectedIds.has(paper.id) ? 'ring-2 ring-blue-500 bg-blue-500/10' : 'hover:-translate-y-1'}
              `}
              onClick={() => {
                if (isSelectionMode) toggleSelection(paper.id);
                else onSelectPaper(paper);
              }}
            >
              {isSelectionMode && (
                <div className="absolute top-3 right-3 z-10">
                  {selectedIds.has(paper.id) ? (
                    <div className="w-5 h-5 bg-blue-500 rounded text-white flex items-center justify-center">
                      <Icons.Check size={14} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-slate-500 rounded bg-transparent" />
                  )}
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Icons.FileText size={24} />
                  </div>
                  {paper.summary && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full font-medium">
                      Analyzed
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2" title={paper.title}>
                  {paper.title}
                </h3>
                
                <a 
                  href={paper.url}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-xs text-slate-400 hover:text-blue-400 truncate mb-4 flex items-center space-x-1"
                >
                  <Icons.ExternalLink size={12} />
                  <span>{paper.url}</span>
                </a>

                <p className="text-sm text-slate-400 line-clamp-3">
                  {paper.summary || "No summary generated yet. Click to analyze."}
                </p>
              </div>

              {!isSelectionMode && (
                <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <select 
                    className="bg-slate-800 text-xs text-slate-300 rounded border border-white/10 px-2 py-1 outline-none max-w-[150px] truncate"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onMovePaper(paper.id, e.target.value)}
                    value={paper.folderId}
                  >
                    <option value="default">Default Folder</option>
                    {folders.filter(f => f.id !== 'default').map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  
                  <button 
                    className="text-red-400 hover:text-red-300 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePaper(paper.id);
                    }}
                  >
                    <Icons.Trash2 size={16} />
                  </button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};