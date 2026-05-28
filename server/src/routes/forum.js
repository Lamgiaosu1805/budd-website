import { Router } from 'express';
import ForumThread from '../models/ForumThread.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/forum — public, newest first
router.get('/', async (_req, res, next) => {
  try {
    const threads = await ForumThread.find().sort({ createdAt: -1 }).limit(100);
    res.json(threads);
  } catch (e) { next(e); }
});

// POST /api/forum — requires login
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { avatar, title, preview, author, topic } = req.body;
    if (!title?.trim() || !preview?.trim()) {
      return res.status(400).json({ error: 'title and preview are required' });
    }
    const thread = await ForumThread.create({
      avatar: avatar || (author ? author[0].toUpperCase() : '❓'),
      title: title.trim(),
      preview: preview.trim(),
      author: author?.trim() || 'anonymous',
      topic: topic?.trim() || '',
    });
    res.status(201).json(thread);
  } catch (e) { next(e); }
});

// PATCH /api/forum/:id — admin only (mark answered, add reply count)
router.patch('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const thread = await ForumThread.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!thread) return res.status(404).json({ error: 'Not found' });
    res.json(thread);
  } catch (e) { next(e); }
});

// DELETE /api/forum/:id — admin only
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await ForumThread.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
