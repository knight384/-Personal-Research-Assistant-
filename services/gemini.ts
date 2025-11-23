import { GroundingSource, SearchFilters } from "../types";

// NOTE: This service now calls the backend /api endpoints.
// This requires the app to be deployed (e.g., on Vercel) to work correctly.

export const performResearch = async (
  topic: string, 
  filters: SearchFilters,
  onStream: (text: string, sources?: GroundingSource[]) => void
): Promise<void> => {
  try {
    const response = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, filters }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    
    let sources: GroundingSource[] = [];
    if (data.groundingMetadata?.groundingChunks) {
      data.groundingMetadata.groundingChunks.forEach((c: any) => {
        if (c.web?.uri && c.web?.title) {
          sources.push({
            title: c.web.title,
            uri: c.web.uri
          });
        }
      });
    }

    // Since serverless functions (basic) return once, we simulate a stream or just send full text
    onStream(data.text, sources.length > 0 ? sources : undefined);

  } catch (error) {
    console.error("Research error:", error);
    onStream("Error: Could not connect to the research server. If you are running this locally without a backend, this is expected. Please deploy to Vercel.");
  }
};

export const analyzePaper = async (title: string, url: string): Promise<{ summary: string, findings: string[], citationMetadata: any }> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Analysis error:", error);
    return {
      summary: "Could not connect to analysis server. Please deploy to Vercel.",
      findings: ["Server connection failed."],
      citationMetadata: { authors: [], publicationDate: '', publisher: '' }
    };
  }
};