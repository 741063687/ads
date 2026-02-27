import { GoogleGenAI, Type } from "@google/genai";
import { Campaign } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAdCopy = async (campaignName: string, objective: string): Promise<string> => {
  try {
    const prompt = `Write 3 engaging, short TikTok ad captions for a campaign named "${campaignName}" with the objective of "${objective}". Include emojis and hashtags. Format the output as a simple list.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate ad copy.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key.";
  }
};

export const analyzeCampaignPerformance = async (campaigns: Campaign[]): Promise<any> => {
  try {
    const dataSummary = JSON.stringify(campaigns.map(c => ({
      name: c.name,
      spend: c.spent,
      roas: c.roas,
      cpa: c.cpa,
      status: c.status
    })));

    const prompt = `Analyze the following TikTok campaign data and identify the top performing campaign and one that needs attention. Return JSON only.
    Data: ${dataSummary}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topPerformer: { type: Type.STRING, description: "Name of best campaign" },
            underPerformer: { type: Type.STRING, description: "Name of worst campaign" },
            insight: { type: Type.STRING, description: "Brief strategic insight (max 30 words)" }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};