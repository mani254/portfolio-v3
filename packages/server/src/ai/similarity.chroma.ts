import { getEmbedding } from "./gemini";
import { getChromaCollection } from "./vectorStore.chroma";

/**
 * V2 retrieval using ChromaDB.
 *
 * ChromaDB handles:
 * - The HNSW index search internally
 * - Returning results already ranked by similarity
 * - No need to load all data into Node.js memory
 */
export async function retrieveRelevantChunksChroma(
  query: string,
  topK = 6
): Promise<string[]> {
  // 1. Embed the user's query (this Gemini call is unavoidable — must vectorize the question)
  const queryEmbedding = await getEmbedding(query);

  if (queryEmbedding.length === 0) {
    console.warn("[ChromaDB retrieval] Got empty embedding for query. Returning empty results.");
    return [];
  }

  // 2. Ask Chroma to find the topK most similar chunks
  const collection = await getChromaCollection();

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],  // our vectorized question
    nResults: topK,                      // how many results to return
    include: ["documents", "distances"], // we want the text + similarity scores
  });

  // results.documents[0] is the array of matching text chunks (already sorted)
  // results.distances[0] is the array of distances (lower = more similar in Chroma's L2 space)
  const chunks = results.documents?.[0] ?? [];

  // Filter out any null/undefined entries Chroma may return
  return chunks.filter((c): c is string => c !== null && c !== undefined);
}
