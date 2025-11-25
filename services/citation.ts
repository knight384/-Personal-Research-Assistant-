import { Paper } from '../types';

export const citationService = {
  generateBibTeX: (papers: Paper[]): string => {
    return papers.map(paper => {
      const meta = paper.citationMetadata;
      const id = (meta?.authors?.[0]?.split(' ').pop() || 'unknown') + (meta?.publicationDate || '2024') + paper.title.split(' ')[0].replace(/[^a-zA-Z]/g, '');
      
      return `@article{${id},
  title = {${paper.title}},
  author = {${meta?.authors?.join(' and ') || 'Unknown'}},
  journal = {${meta?.publisher || 'Unknown Publisher'}},
  year = {${meta?.publicationDate || 'n.d.'}},
  url = {${paper.url}}
}`;
    }).join('\n\n');
  },

  generateAPA: (papers: Paper[]): string => {
    return papers.map(paper => {
      const meta = paper.citationMetadata;
      const authors = meta?.authors?.join(', ') || 'Unknown Author';
      const year = meta?.publicationDate ? `(${meta.publicationDate})` : '(n.d.)';
      const title = paper.title;
      const source = meta?.publisher || 'Retrieved from';
      
      return `${authors}. ${year}. ${title}. ${source}. ${paper.url}`;
    }).join('\n\n');
  },

  downloadCitation: (content: string, format: 'bibtex' | 'apa') => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `citations.${format === 'bibtex' ? 'bib' : 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};