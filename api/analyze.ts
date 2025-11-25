import { GoogleGenAI, Type } from "@google/genai";

<<<<<<< HEAD
// This file will run on the Vercel Server
=======
export const config = {
  runtime: 'edge',
};

>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { title, url } = await request.json();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Analyze the following research source:
      Title: ${title}
      URL: ${url}

      Please provide:
      1. A concise summary of the paper/article (approx 150 words).
      2. A list of 3-5 key findings or takeaways.
<<<<<<< HEAD
      3. Extract citation metadata if available (Authors, Publication Year, Publisher/Journal).
=======
      3. Extract citation metadata if available (Authors, Publication Year, Publisher/Journal, DOI, and Page Count).
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc

      Output in JSON format with keys: "summary" (string), "findings" (array of strings), and "citationMetadata" (object).
    `;

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
<<<<<<< HEAD
                doi: { type: Type.STRING }
=======
                doi: { type: Type.STRING },
                pageCount: { type: Type.INTEGER }
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
              }
            }
          }
        }
      }
    });

    return new Response(response.text, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}