import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import lectureRoutes from './routes/lectures.js';
import teacherEventRoutes from './routes/teacher-events.js';
import { ensureSeedAdmin } from './seed-admin.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/teacher-events', teacherEventRoutes);

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
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error('Startup failed', e);
  process.exit(1);
});
