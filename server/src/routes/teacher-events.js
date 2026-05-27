import { Router } from 'express';
import TeacherEvent from '../models/TeacherEvent.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await TeacherEvent.find().sort({ createdAt: 1 });
    res.json(items.map((i) => i.toJSON()));
  } catch (e) { next(e); }
});

router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const item = await TeacherEvent.create(req.body);
    res.json(item.toJSON());
  } catch (e) { next(e); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const item = await TeacherEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item.toJSON());
  } catch (e) { next(e); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const item = await TeacherEvent.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
