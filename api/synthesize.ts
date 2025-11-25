import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { papers, folderName } = await request.json();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const papersContext = papers.map((p: any, index: number) => `
    [Paper ${index + 1}]
    Title: ${p.title}
    Summary: ${p.summary || 'No summary available'}
    Key Findings: ${p.keyFindings?.join('; ') || 'N/A'}
    `).join('\n\n');

    const prompt = `
      You are a research assistant. I have a collection of papers in a folder named "${folderName}".
      
      Here is the data for the papers:
      ${papersContext}

      Please write a "Literature Synthesis" for this collection. 
      1. Identify common themes or trends across these papers.
      2. Highlight any contradictions or diverse viewpoints.
      3. Summarize the collective knowledge found here.
      
      Keep it concise (under 250 words) but insightful. Use Markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return new Response(JSON.stringify({ synthesis: response.text }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}