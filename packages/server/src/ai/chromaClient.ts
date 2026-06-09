import { ChromaClient } from "chromadb";

// Reads CHROMA_URL from env — defaults to local Docker instance
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

export const chroma = new ChromaClient({ path: CHROMA_URL });

/**
 * Ping ChromaDB to verify the server is reachable before doing any work.
 * Returns true if connected, false otherwise.
 */
export async function isChromaReachable(): Promise<boolean> {
  try {
    await chroma.heartbeat();
    return true;
  } catch {
    return false;
  }
}