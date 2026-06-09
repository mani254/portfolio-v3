import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from "../config/env";

const genAI = new GoogleGenerativeAI(getGeminiApiKey());

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    const result = await model.embedContent(text);

    return result.embedding.values;
  }
  catch (error: any) {
    console.log('error.message', error.message)
    console.log('error', error)
    return []
  }
}