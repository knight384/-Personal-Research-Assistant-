import { GoogleGenAI } from "@google/genai";

// This file will run on the Vercel Server
// It securely uses the process.env.API_KEY
export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { topic, filters } = await request.json();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return new Response(JSON.stringify({ text, groundingMetadata }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}