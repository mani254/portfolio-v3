import { getEmbedding } from "./gemini";
import { PORTFOLIO_CHUNKS } from "./consts";
import { chroma, isChromaReachable } from "./chromaClient";

const COLLECTION_NAME = "portfolio";

/**
 * Seeds ChromaDB from PORTFOLIO_CHUNKS on first run only.
 *
 * Strategy (simple, token-safe):
 * - If collection already has ANY items → skip entirely (0 Gemini API calls)
 * - Only embeds on the very first run when the collection is empty
 *
 * After the first seed, ALL chunk management is done via the Admin Dashboard API:
 *   POST   /api/chunks          → add
 *   PUT    /api/chunks/:id      → edit
 *   DELETE /api/chunks/:id      → delete
 *   POST   /api/chunks/bulk     → bulk add
 *   POST   /api/chunks/upload   → upload .txt file
 */
export async function buildChromaVectorStore(): Promise<void> {
  const reachable = await isChromaReachable();
  if (!reachable) {
    throw new Error(
      `[ChromaDB] Cannot reach server at ${process.env.CHROMA_URL || "http://localhost:8000"}.\n` +
        `Make sure Docker is running:\n  cd e:/personal-projects/portfolio-v3\n  docker compose up -d`
    );
  }

  const collection = await chroma.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { description: "Manikanta Mamidi portfolio knowledge base" },
  });

  const existingCount = await collection.count();
  if (existingCount > 0) {
    console.log(
      `[ChromaDB] Collection "${COLLECTION_NAME}" has ${existingCount} items. Skipping seed. (0 Gemini API calls)`
    );
    return;
  }

  // First ever run — seed from consts.ts
  console.log(
    `[ChromaDB] Empty collection. Seeding ${PORTFOLIO_CHUNKS.length} chunks from consts.ts...`
  );

  const ids: string[] = [];
  const embeddings: number[][] = [];
  const documents: string[] = [];
  const metadatas: Record<string, string>[] = [];

  for (let i = 0; i < PORTFOLIO_CHUNKS.length; i++) {
    const text = PORTFOLIO_CHUNKS[i];
    console.log(`  [${i + 1}/${PORTFOLIO_CHUNKS.length}] Embedding "${text.slice(0, 60)}..."`);

    const embedding = await getEmbedding(text);
    if (embedding.length === 0) {
      console.warn(`  ⚠ Skipping chunk ${i} — empty embedding returned`);
      continue;
    }

    ids.push(`chunk_${i}`);
    embeddings.push(embedding);
    documents.push(text);
    metadatas.push({ index: String(i), source: "consts" });

    if (i < PORTFOLIO_CHUNKS.length - 1) {
      await new Promise((r) => setTimeout(r, 1000)); // rate limit
    }
  }

  await collection.upsert({ ids, embeddings, documents, metadatas });
  console.log(`[ChromaDB] ✅ Seeded ${ids.length} chunks. Manage them via the Admin Dashboard.`);
}

/**
 * Returns the ChromaDB collection.
 * Used by both the retrieval pipeline and the admin chunk controller.
 */
export async function getChromaCollection() {
  return chroma.getOrCreateCollection({ name: COLLECTION_NAME });
}
