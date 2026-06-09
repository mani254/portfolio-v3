import { getEmbedding } from "./gemini";
import { getVectorStore } from "./vectorStore";

export function cosineSimilarity(a: number[], b: number[]) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);

  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
}


export async function retrieveRelevantChunks(query: string, topK = 6) {
  const queryEmbedding = await getEmbedding(query);
  const store = getVectorStore();

  const scored = store.map((item) => ({
    text: item.text,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map((item) => item.text);
}