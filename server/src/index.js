import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import lectureRoutes from './routes/lectures.js';
import teacherEventRoutes from './routes/teacher-events.js';
import blogRoutes from './routes/blog.js';
import uploadRoutes from './routes/upload.js';
import forumRoutes from './routes/forum.js';
import settingsRoutes from './routes/settings.js';
import { ensureSeedAdmin } from './seed-admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const app = express();

// CORS chỉ cần khi dev (Vite dev server khác port)
if (!isProd) {
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
  }));
}

app.use(express.json({ limit: '2mb' }));

// Serve uploaded images publicly — cùng đường dẫn với UPLOADS_DIR trong upload.js
const uploadsDir = process.env.UPLOADS_DIR || '/var/data/uploads';
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/teacher-events', teacherEventRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/settings', settingsRoutes);

// Serve React build trong production
const clientDist = join(__dirname, '../../client/dist');
if (isProd && existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA fallback — mọi route không phải /api đều trả index.html
  app.get('*', (req, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
}

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Copy server/.env.example to server/.env');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected:', mongoose.connection.name);

  await ensureSeedAdmin();

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

start().catch((e) => {
  console.error('Startup failed', e);
  process.exit(1);
});
