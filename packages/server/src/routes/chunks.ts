import { Router } from 'express';
import multer from 'multer';
import { adminGuard } from '../middleware/adminGuard';
import {
  listChunks,
  getChunkStats,
  addChunk,
  updateChunk,
  deleteChunk,
  bulkAddChunks,
  uploadChunks,
  bulkDeleteChunks,
} from '../controllers/chunksController';

const router = Router();

// Multer: memory storage, only allow .txt files, max 2MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed'));
    }
  },
});

// All routes protected by adminGuard
router.use(adminGuard);

// ─── Collection stats ──────────────────────────────────────────────
router.get('/stats',       getChunkStats);

// ─── CRUD ──────────────────────────────────────────────────────────
router.get('/',            listChunks);
router.post('/',           addChunk);
router.put('/:id',         updateChunk);
router.delete('/:id',      deleteChunk);

// ─── Bulk operations ───────────────────────────────────────────────
router.post('/bulk',       bulkAddChunks);
router.post('/bulk-delete', bulkDeleteChunks);
router.post('/upload',     upload.single('file'), uploadChunks);

export default router;
