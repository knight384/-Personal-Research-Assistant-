export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  RESEARCH = 'RESEARCH',
  LIBRARY = 'LIBRARY',
  SETTINGS = 'SETTINGS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface CitationMetadata {
  authors: string[];
  publicationDate?: string;
  publisher?: string;
  doi?: string;
}

export interface Paper {
  id: string;
  folderId: string;
  title: string;
  url: string;
  snippet?: string;
  summary?: string;
  keyFindings?: string[];
  citationMetadata?: CitationMetadata;
  userNotes: string;
  addedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
  isThinking?: boolean;
}

export interface SearchFilters {
  yearStart?: string;
  yearEnd?: string;
  author?: string;
  journal?: string;
}