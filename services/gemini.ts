import { GoogleGenAI, Type } from "@google/genai";
import { GroundingSource, SearchFilters } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performResearch = async (
  topic: string, 
  filters: SearchFilters,
  onStream: (text: string, sources?: GroundingSource[]) => void
): Promise<void> => {
  const ai = getAI();
  
  let prompt = `Perform a comprehensive research search on the topic: "${topic}". `;
  
  if (filters.yearStart || filters.yearEnd || filters.author || filters.journal) {
    prompt += `\nStrictly prioritize sources matching these criteria:`;
    if (filters.yearStart) prompt += `\n- Published after: ${filters.yearStart}`;
    if (filters.yearEnd) prompt += `\n- Published before: ${filters.yearEnd}`;
    if (filters.author) prompt += `\n- Author: ${filters.author}`;
    if (filters.journal) prompt += `\n- Journal/Conference: ${filters.journal}`;
  }

  prompt += `\nFocus on finding academic papers, technical articles, or reputable sources. 
  Summarize the current state of the art or key discussions around this topic.
  Do not format as JSON. Write a clear, structured research summary.`;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let fullText = '';
    let sources: GroundingSource[] = [];

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        fullText += text;
      }
      
      // Extract grounding chunks if available
      const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((c: any) => {
          if (c.web?.uri && c.web?.title) {
            sources.push({
              title: c.web.title,
              uri: c.web.uri
            });
          }
        });
      }
      
      onStream(fullText, sources.length > 0 ? sources : undefined);
    }
  } catch (error) {
    console.error("Research error:", error);
    onStream("An error occurred while researching. Please check your API key or try again.");
  }
};

export const analyzePaper = async (title: string, url: string): Promise<{ summary: string, findings: string[], citationMetadata: any }> => {
  const ai = getAI();
  
  const prompt = `
    Analyze the following research source:
    Title: ${title}
    URL: ${url}

    Please provide:
    1. A concise summary of the paper/article (approx 150 words).
    2. A list of 3-5 key findings or takeaways.
    3. Extract citation metadata if available (Authors, Publication Year, Publisher/Journal).

    Output in JSON format with keys: "summary" (string), "findings" (array of strings), and "citationMetadata" (object).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            citationMetadata: {
              type: Type.OBJECT,
              properties: {
                authors: { type: Type.ARRAY, items: { type: Type.STRING } },
                publicationDate: { type: Type.STRING },
                publisher: { type: Type.STRING },
                doi: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis error:", error);
    return {
      summary: "Could not generate summary at this time.",
      findings: ["Analysis failed."],
      citationMetadata: { authors: [], publicationDate: '', publisher: '' }
    };
  }
};