import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import path from 'path';
import { mkdirSync } from 'fs';
import { authenticate, requireAdmin } from '../middleware/auth.js';

// Đường dẫn lưu ảnh — đặt NGOÀI project, mount qua Docker volume trên server
// Dokploy: thêm volume binding /var/data/kct-uploads:/var/data/uploads trong cài đặt service
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/var/data/uploads';

// Tạo thư mục nếu chưa tồn tại (lần đầu deploy)
try { mkdirSync(UPLOADS_DIR, { recursive: true }); } catch {}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = Router();

router.post('/', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;
