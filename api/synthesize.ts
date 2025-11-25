import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { papers, folderName } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const papersContext = papers.map((p, index) => `
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

    return res.status(200).json({ synthesis: response.text });

  } catch (error) {
    console.error("Synthesis API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}