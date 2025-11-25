import React, { useState } from 'react';
import { Paper } from '../types';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';
import { analyzePaper } from '../services/gemini';

interface DocumentDetailProps {
  paper: Paper;
  onClose: () => void;
  onUpdatePaper: (updatedPaper: Paper) => void;
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({ paper, onClose, onUpdatePaper }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'notes'>('analysis');
  const [notes, setNotes] = useState(paper.userNotes);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzePaper(paper.title, paper.url);
    onUpdatePaper({
      ...paper,
      summary: result.summary,
      keyFindings: result.findings,
      citationMetadata: result.citationMetadata
    });
    setIsAnalyzing(false);
  };

  const handleSaveNotes = () => {
    onUpdatePaper({
      ...paper,
      userNotes: notes
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a]/95 backdrop-blur-xl absolute inset-0 z-20">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-4 overflow-hidden">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Icons.ChevronRight className="rotate-180" size={24} />
          </button>
          <div className="flex-1 min-w-0">
             <h2 className="text-xl font-bold text-white truncate" title={paper.title}>{paper.title}</h2>
             <a href={paper.url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline flex items-center space-x-1">
               <span>View Original Source</span>
               <Icons.ExternalLink size={12} />
             </a>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!paper.summary && (
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Icons.Sparkles size={16} />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6">
          
          <div className="flex space-x-6 border-b border-white/10 mb-6">
            <button 
              onClick={() => setActiveTab('analysis')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'analysis' 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Analysis
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'notes' 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              My Notes
            </button>
          </div>

          {activeTab === 'analysis' && (
            <div className="space-y-6 animate-fade-in">
              {!paper.summary ? (
                <div className="text-center py-20 text-slate-500">
                  <Icons.Bot size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No analysis generated yet.</p>
                  <p className="text-sm">Click "Analyze with AI" to generate a summary and key findings.</p>
                </div>
              ) : (
                <>
                  <section>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Icons.FileText size={18} className="text-blue-400" />
                      <span>Summary</span>
                    </h3>
                    <GlassCard className="p-6 text-slate-300 leading-relaxed">
                      {paper.summary}
                    </GlassCard>
                  </section>

                  {paper.citationMetadata && (paper.citationMetadata.authors?.length > 0 || paper.citationMetadata.publicationDate) && (
                    <section>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                        <Icons.Quote size={18} className="text-green-400" />
                        <span>Citation Data</span>
                      </h3>
                      <GlassCard className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="block text-xs text-slate-500 uppercase tracking-wide">Authors</span>
                          <span className="text-slate-200">{paper.citationMetadata.authors?.join(', ') || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-slate-500 uppercase tracking-wide">Publication Year</span>
                          <span className="text-slate-200">{paper.citationMetadata.publicationDate || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-slate-500 uppercase tracking-wide">Publisher / Journal</span>
                          <span className="text-slate-200">{paper.citationMetadata.publisher || 'N/A'}</span>
                        </div>
                        <div>
                           <span className="block text-xs text-slate-500 uppercase tracking-wide">DOI</span>
                           <span className="text-slate-200">{paper.citationMetadata.doi || 'N/A'}</span>
                        </div>
                      </GlassCard>
                    </section>
                  )}

                  <section>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Icons.Library size={18} className="text-purple-400" />
                      <span>Key Findings</span>
                    </h3>
                    <div className="grid gap-4">
                      {paper.keyFindings?.map((finding, idx) => (
                        <GlassCard key={idx} className="p-4 flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-300">{finding}</span>
                        </GlassCard>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="h-full flex flex-col animate-fade-in">
              <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 bg-black/20">
                <div className="p-2 bg-white/5 border-b border-white/10 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium px-2">MARKDOWN EDITOR</span>
                  <button 
                    onClick={handleSaveNotes}
                    className="flex items-center space-x-1 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
                  >
                    <Icons.Save size={12} />
                    <span>Save Note</span>
                  </button>
                </div>
                <textarea
                  className="flex-1 bg-transparent p-6 resize-none focus:outline-none text-slate-300 leading-relaxed font-mono text-sm"
                  placeholder="# My Research Notes&#10;&#10;- Important point 1&#10;- Idea for later..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};