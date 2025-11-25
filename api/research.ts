import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, filters } = req.body;
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

    return res.status(200).json({ text, groundingMetadata });

  } catch (error) {
    console.error("Research API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}