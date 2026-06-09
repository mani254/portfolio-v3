import fs from 'fs';
import path from 'path';
import { getEmbedding } from "./gemini";
import { PORTFOLIO_CHUNKS } from "./consts";



type VectorItem = {
  text: string;
  embedding: number[];
};

let vectorStore: VectorItem[] = [];
// Store the JSON file at the root of the server package
const STORE_PATH = path.join(__dirname, '..', '..', 'vector_store.json');

export async function buildVectorStore() {
  if (fs.existsSync(STORE_PATH)) {
    console.log('Loading vector store from local cache...');
    const fileContent = fs.readFileSync(STORE_PATH, 'utf-8');
    vectorStore = JSON.parse(fileContent);
    return;
  }

  console.log('Local cache not found. Generating embeddings incrementally...');
  const newStore: VectorItem[] = [];

  for (let i = 0; i < PORTFOLIO_CHUNKS.length; i++) {
    const text = PORTFOLIO_CHUNKS[i];
    console.log(`Generating embedding for chunk ${i + 1}/${PORTFOLIO_CHUNKS.length}`);
    const embedding = await getEmbedding(text);
    
    if (embedding.length > 0) {
      newStore.push({ text, embedding });
    }
    
    // Add 1s delay to prevent "429 Too Many Requests"
    await new Promise(r => setTimeout(r, 1000));
  }

  vectorStore = newStore; 

  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(vectorStore, null, 2));
    console.log(`Saved vector store to local cache: ${STORE_PATH}`);
  } catch (err) {
    console.error('Failed to save vector store:', err);
  }
}

export function getVectorStore() {
  return vectorStore;
}