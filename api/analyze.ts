import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

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
      3. Extract citation metadata if available (Authors, Publication Year, Publisher/Journal, DOI, and Page Count).

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
                doi: { type: Type.STRING },
                pageCount: { type: Type.INTEGER }
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