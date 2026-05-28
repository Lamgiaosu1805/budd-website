import { Router } from 'express';
import Setting from '../models/Setting.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/settings — public, returns { key: value, ... }
router.get('/', async (_req, res, next) => {
  try {
    const rows = await Setting.find();
    const obj = {};
    rows.forEach(r => { obj[r.key] = r.value; });
    res.json(obj);
  } catch (e) { next(e); }
});

// PUT /api/settings — admin only, upsert multiple keys at once
// body: { teacher_portrait: '/uploads/xxx.jpg', ... }
router.put('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const entries = Object.entries(req.body || {});
    await Promise.all(entries.map(([key, value]) =>
      Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
    ));
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
