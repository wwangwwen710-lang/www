
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

export const generateWallpaper = async (
  prompt: string,
  config: { aspectRatio: AspectRatio; imageSize: ImageSize },
  referenceImageBase64?: string
): Promise<string> => {
  // Always create a new instance to get the latest API key from the dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [{ text: prompt }];
  
  if (referenceImageBase64) {
    // Extract actual base64 data if it includes data URL prefix
    const base64Data = referenceImageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");
    parts.unshift({
      inlineData: {
        mimeType: "image/png",
        data: base64Data,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize,
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error: any) {
    if (error?.message?.includes("Requested entity was not found")) {
      // Re-trigger API Key selection if it's a 404/Not Found usually related to invalid billing/keys
      await (window as any).aistudio.openSelectKey();
    }
    throw error;
  }
};
