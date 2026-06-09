import { Request, Response, NextFunction } from 'express';
import { getChromaCollection } from '../ai/vectorStore.chroma';
import { getEmbedding } from '../ai/gemini';
import { BadRequestError, NotFoundError } from '../utils/errors';
import type { AdminRequest } from '../middleware/adminGuard';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ChromaChunk {
  id: string;
  text: string;
  distance?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Embed a text string and upsert it into ChromaDB.
 */
async function embedAndUpsert(id: string, text: string): Promise<void> {
  const collection = await getChromaCollection();
  const embedding = await getEmbedding(text);
  if (embedding.length === 0) {
    throw new BadRequestError('Embedding generation failed — Gemini returned an empty vector.');
  }
  await collection.upsert({
    ids: [id],
    embeddings: [embedding],
    documents: [text],
    metadatas: [{ createdAt: new Date().toISOString() }],
  });
}

/**
 * Generate a stable unique ID for a new chunk.
 * Uses timestamp + random suffix to avoid collisions.
 */
function generateChunkId(): string {
  return `chunk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /api/chunks
 * List all chunks with pagination and optional text search.
 */
export const listChunks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string | undefined)?.trim().toLowerCase();

    const collection = await getChromaCollection();

    // Fetch all items from Chroma (include documents but NOT embeddings — saves memory)
    const all = await collection.get({ include: ['documents', 'metadatas'] as any });

    let items: ChromaChunk[] = (all.ids || []).map((id, i) => ({
      id,
      text: all.documents?.[i] ?? '',
    }));

    // Text search filter
    if (search) {
      items = items.filter((c) => c.text.toLowerCase().includes(search));
    }

    // Sort by ID so order is stable
    items.sort((a, b) => a.id.localeCompare(b.id));

    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = items.slice((page - 1) * limit, page * limit);

    res.json({
      data: paginated,
      meta: { total, page, limit, totalPages },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/chunks/stats
 * Returns aggregate stats about the collection.
 */
export const getChunkStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const collection = await getChromaCollection();
    const count = await collection.count();

    res.json({
      data: {
        total: count,
        collectionName: 'portfolio',
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/chunks
 * Add a single chunk.
 * Body: { text: string }
 */
export const addChunk = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { text } = req.body as { text?: string };
    if (!text || text.trim().length === 0) {
      throw new BadRequestError('text is required and must not be empty');
    }

    const id = generateChunkId();
    await embedAndUpsert(id, text.trim());

    res.status(201).json({ message: 'Chunk added', data: { id, text: text.trim() } });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/chunks/:id
 * Edit the text of an existing chunk (re-embeds it).
 * Body: { text: string }
 */
export const updateChunk = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { text } = req.body as { text?: string };
    if (!text || text.trim().length === 0) {
      throw new BadRequestError('text is required and must not be empty');
    }

    // Verify the chunk exists
    const collection = await getChromaCollection();
    const existing = await collection.get({ ids: [id], include: [] as any });
    if (!existing.ids || existing.ids.length === 0) {
      throw new NotFoundError(`Chunk "${id}" not found`);
    }

    // Re-embed with new text
    await embedAndUpsert(id, text.trim());

    res.json({ message: 'Chunk updated', data: { id, text: text.trim() } });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/chunks/:id
 * Hard delete a chunk from ChromaDB.
 */
export const deleteChunk = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const collection = await getChromaCollection();
    const existing = await collection.get({ ids: [id], include: [] as any });
    if (!existing.ids || existing.ids.length === 0) {
      throw new NotFoundError(`Chunk "${id}" not found`);
    }

    await collection.delete({ ids: [id] });
    res.json({ message: 'Chunk deleted', data: { id } });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/chunks/bulk
 * Add multiple chunks at once.
 * Body: { texts: string[] }
 */
export const bulkAddChunks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { texts } = req.body as { texts?: string[] };
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new BadRequestError('texts must be a non-empty array of strings');
    }

    const validTexts = texts.map((t) => t.trim()).filter((t) => t.length > 0);
    if (validTexts.length === 0) {
      throw new BadRequestError('All provided texts are empty');
    }

    const results: { id: string; text: string; status: 'ok' | 'error'; error?: string }[] = [];

    for (const text of validTexts) {
      const id = generateChunkId();
      try {
        await embedAndUpsert(id, text);
        results.push({ id, text, status: 'ok' });
        // Rate limit: 1 req/sec to stay within Gemini free tier
        await new Promise((r) => setTimeout(r, 1000));
      } catch (err: any) {
        results.push({ id, text, status: 'error', error: err.message });
      }
    }

    const succeeded = results.filter((r) => r.status === 'ok').length;
    res.status(201).json({
      message: `Bulk add complete: ${succeeded}/${validTexts.length} succeeded`,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/chunks/upload
 * Upload a .txt file — each non-empty line becomes a chunk.
 * Uses multer (configured in the route file).
 */
export const uploadChunks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      throw new BadRequestError('No file uploaded. Please upload a .txt file.');
    }

    const content = file.buffer.toString('utf-8');
    const lines = content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#')); // skip empty lines and comment lines

    if (lines.length === 0) {
      throw new BadRequestError('The uploaded file contains no valid text lines.');
    }

    const results: { id: string; text: string; status: 'ok' | 'error'; error?: string }[] = [];

    for (const text of lines) {
      const id = generateChunkId();
      try {
        await embedAndUpsert(id, text);
        results.push({ id, text, status: 'ok' });
        await new Promise((r) => setTimeout(r, 1000));
      } catch (err: any) {
        results.push({ id, text, status: 'error', error: err.message });
      }
    }

    const succeeded = results.filter((r) => r.status === 'ok').length;
    res.status(201).json({
      message: `File processed: ${succeeded}/${lines.length} chunks added`,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/chunks/bulk-delete
 * Delete multiple chunks at once.
 * Body: { ids: string[] }
 */
export const bulkDeleteChunks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { ids } = req.body as { ids?: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError('ids must be a non-empty array of chunk IDs');
    }

    const collection = await getChromaCollection();
    await collection.delete({ ids });

    res.json({ message: `Deleted ${ids.length} chunks`, data: { ids } });
  } catch (err) {
    next(err);
  }
};
