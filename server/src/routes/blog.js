import { Router } from 'express';
import Blog from '../models/Blog.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: list published posts newest-first
router.get('/', async (req, res, next) => {
  try {
    const items = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(items.map((i) => i.toJSON()));
  } catch (e) { next(e); }
});

// Admin: list ALL posts including drafts
router.get('/all', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const items = await Blog.find().sort({ createdAt: -1 });
    res.json(items.map((i) => i.toJSON()));
  } catch (e) { next(e); }
});

router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const item = await Blog.create(req.body);
    res.json(item.toJSON());
  } catch (e) { next(e); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const item = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item.toJSON());
  } catch (e) { next(e); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
