// V1 — in-memory
import {
  buildVectorStore as buildLocalVectorStore,
} from "./vectorStore";
import { retrieveRelevantChunks as retrieveLocal } from "./similarity";

// V2 — ChromaDB
import {
  buildChromaVectorStore,
} from "./vectorStore.chroma";
import { retrieveRelevantChunksChroma } from "./similarity.chroma";

const USE_CHROMA = (process.env.VECTOR_STORE || "local").toLowerCase() === "chroma";

console.log(`[retriever] Vector store mode: ${USE_CHROMA ? "ChromaDB (V2)" : "In-Memory (V1)"}`);

/**
 * Unified build function — called once at server startup (index.ts).
 * Internally calls V1 or V2 based on VECTOR_STORE env var.
 */
export async function buildVectorStore(): Promise<void> {
  if (USE_CHROMA) {
    return buildChromaVectorStore();
  }
  return buildLocalVectorStore();
}

/**
 * Unified retrieval function — called per user message (groq.ts).
 * Internally calls V1 or V2 based on VECTOR_STORE env var.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK = 6
): Promise<string[]> {
  if (USE_CHROMA) {
    return retrieveRelevantChunksChroma(query, topK);
  }
  return retrieveLocal(query, topK);
}
