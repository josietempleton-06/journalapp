
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly follow SDK initialization using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyPrompt = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Give me one creative, deep, and inspiring journal prompt for today. Keep it short (max 20 words).",
      config: {
        temperature: 0.9,
      },
    });
    // Fix: Access response.text property directly as a getter, not a method
    return response.text?.trim() || "What are three things you're grateful for today?";
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return "What made you smile today?";
  }
};

export const analyzeJournalEntry = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a supportive, empathetic AI journal assistant. 
      Read this journal entry and provide a brief (2-3 sentence) supportive reflection or insight. 
      Avoid being clinical; be warm and encouraging.
      
      Entry: "${content}"`,
      config: {
        temperature: 0.7,
      },
    });
    // Fix: Access response.text property directly as per latest SDK guidelines
    return response.text?.trim() || "Thank you for sharing your thoughts today.";
  } catch (error) {
    console.error("Error analyzing entry:", error);
    return "It's brave to put your thoughts on paper. Keep reflecting!";
  }
};
