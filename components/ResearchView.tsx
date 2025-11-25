import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GroundingSource, SearchFilters } from '../types';
import { performResearch } from '../services/gemini';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';

interface ResearchViewProps {
  onAddPaper: (source: GroundingSource) => void;
  savedUrls: Set<string>;
}

export const ResearchView: React.FC<ResearchViewProps> = ({ onAddPaper, savedUrls }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    yearStart: '',
    yearEnd: '',
    author: '',
    journal: ''
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      text: 'Hello! I am your research assistant. Enter a topic, and I will find academic papers and key articles for you using Google Search Grounding.'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query
    };

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      text: '',
      isThinking: true
    };

    setMessages(prev => [...prev, userMsg, modelMsg]);
    setQuery('');
    setIsSearching(true);
    setShowFilters(false);

    await performResearch(userMsg.text, filters, (text, sources) => {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, text, sources, isThinking: false } 
          : msg
      ));
    });

    setIsSearching(false);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 pb-40">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl animate-fade-in-up ${msg.role === 'user' ? 'ml-12' : 'mr-12'}`}>
              
              {msg.role === 'model' && (
                <div className="flex items-center space-x-2 mb-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <Icons.Bot size={14} />
                  <span>Research Agent</span>
                </div>
              )}

              <GlassCard className={`p-6 ${msg.role === 'user' ? 'bg-blue-600/20 border-blue-500/30' : 'bg-slate-900/40'}`}>
                {msg.isThinking && !msg.text ? (
                   <div className="flex space-x-2 items-center text-slate-400">
                     <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                     <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75" />
                     <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                     <span className="text-sm">Searching academic sources...</span>
                   </div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}
              </GlassCard>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 grid gap-3 grid-cols-1 md:grid-cols-2">
                  {msg.sources.map((source, idx) => {
                    const isSaved = savedUrls.has(source.uri);
                    return (
                      <GlassCard key={idx} className="p-3 flex flex-col justify-between group hover:border-blue-400/50">
                        <div>
                          <h4 className="font-semibold text-sm text-blue-100 line-clamp-2 mb-1" title={source.title}>
                            {source.title}
                          </h4>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 truncate"
                          >
                            <Icons.ExternalLink size={10} />
                            <span className="truncate">{source.uri}</span>
                          </a>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                          <button
                            disabled={isSaved}
                            onClick={() => onAddPaper(source)}
                            className={`
                              flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium transition-colors
                              ${isSaved 
                                ? 'bg-green-500/20 text-green-300 cursor-default' 
                                : 'bg-white/10 hover:bg-blue-500/20 text-slate-200 hover:text-blue-200'}
                            `}
                          >
                            {isSaved ? (
                              <>
                                <Icons.Check size={12} />
                                <span>Saved</span>
                              </>
                            ) : (
                              <>
                                <Icons.Plus size={12} />
                                <span>Add to Library</span>
                              </>
                            )}
                          </button>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent z-10">
        <div className="max-w-3xl mx-auto space-y-2">
          
          {showFilters && (
            <GlassCard className="p-4 mb-2 animate-fade-in">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Advanced Search Filters</span>
                <button onClick={() => setShowFilters(false)}><Icons.X size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Published After (Year)</label>
                  <input 
                    type="number" 
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="2020"
                    value={filters.yearStart}
                    onChange={e => setFilters({...filters, yearStart: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Published Before (Year)</label>
                  <input 
                    type="number" 
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="2024"
                    value={filters.yearEnd}
                    onChange={e => setFilters({...filters, yearEnd: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Specific Author</label>
                  <div className="relative">
                    <Icons.PenTool size={12} className="absolute left-2 top-2 text-slate-500" />
                    <input 
                      type="text" 
                      className="w-full bg-black/20 border border-white/10 rounded pl-7 pr-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Yoshua Bengio"
                      value={filters.author}
                      onChange={e => setFilters({...filters, author: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Journal / Conference</label>
                  <div className="relative">
                    <Icons.BookOpen size={12} className="absolute left-2 top-2 text-slate-500" />
                    <input 
                      type="text" 
                      className="w-full bg-black/20 border border-white/10 rounded pl-7 pr-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Nature, CVPR"
                      value={filters.journal}
                      onChange={e => setFilters({...filters, journal: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          <GlassCard className="p-2 flex items-center space-x-2 border-blue-500/20 shadow-blue-900/20">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:bg-white/5'}`}
              title="Search Filters"
            >
              <Icons.Filter size={20} />
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none py-2"
                placeholder="Enter a research topic (e.g., 'Quantum Computing Advances')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
              />
            </form>
            <button 
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            >
              <Icons.ChevronRight size={20} />
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};