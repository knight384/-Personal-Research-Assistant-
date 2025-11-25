import React, { useState } from 'react';
import { Paper, Folder } from '../types';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';
import { citationService } from '../services/citation';

interface LibraryViewProps {
  papers: Paper[];
  folders: Folder[];
  activeFolderId: string | null;
  onSelectPaper: (paper: Paper) => void;
  onMovePaper: (paperId: string, folderId: string) => void;
  onDeletePaper: (paperId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ 
  papers, 
  folders, 
  activeFolderId,
  onSelectPaper,
  onMovePaper,
  onDeletePaper
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredPapers = activeFolderId 
    ? papers.filter(p => p.folderId === activeFolderId)
    : papers;

  const currentFolderName = activeFolderId 
    ? folders.find(f => f.id === activeFolderId)?.name 
    : 'All Documents';

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleExport = (format: 'bibtex' | 'apa') => {
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

  return (
    <div className="p-6 lg:p-10 h-full overflow-y-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{currentFolderName}</h1>
          <p className="text-slate-400">
            {filteredPapers.length} {filteredPapers.length === 1 ? 'document' : 'documents'} collected
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isSelectionMode ? (
            <>
               <span className="text-sm text-slate-400">{selectedIds.size} selected</span>
               <div className="relative">
                 <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-blue-500"
                 >
                   <Icons.Quote size={16} />
                   <span>Export</span>
                 </button>
                 {showExportMenu && (
                   <div className="absolute top-full right-0 mt-2 w-32 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                     <button 
                       onClick={() => handleExport('bibtex')}
                       className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white"
                     >
                       BibTeX
                     </button>
                     <button 
                       onClick={() => handleExport('apa')}
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
            <button 
              onClick={() => setIsSelectionMode(true)}
              disabled={filteredPapers.length === 0}
              className="bg-white/5 border border-white/10 text-slate-300 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-white/10 disabled:opacity-50"
            >
              <Icons.CheckSquare size={16} />
              <span>Select</span>
            </button>
          )}
        </div>
      </header>

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
                    className="bg-slate-800 text-xs text-slate-300 rounded border border-white/10 px-2 py-1 outline-none"
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