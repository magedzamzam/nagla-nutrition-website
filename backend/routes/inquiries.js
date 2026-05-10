import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { nanoid } from 'nanoid';
import { getDb } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const db = getDb();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: { error: 'Too many requests, please try again later.' },
});

// ============== PUBLIC ==============
// POST /api/inquiries — submit a booking request
router.post('/', submitLimiter, (req, res) => {
  const { name, phone, email, preferred_location, preferred_time, reason, message, hp } = req.body || {};

  // Honeypot field — bots fill this, humans never see it
  if (hp) return res.json({ ok: true });

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }
  if (name.length > 100 || phone.length > 30) {
    return res.status(400).json({ error: 'Field too long' });
  }

  const id = nanoid(12);
  db.prepare(`
    INSERT INTO inquiries (id, name, phone, email, preferred_location, preferred_time, reason, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
  `).run(
    id,
    String(name).slice(0, 100),
    String(phone).slice(0, 30),
    email ? String(email).slice(0, 100) : null,
    preferred_location ? String(preferred_location).slice(0, 50) : null,
    preferred_time ? String(preferred_time).slice(0, 50) : null,
    reason ? String(reason).slice(0, 100) : null,
    message ? String(message).slice(0, 1000) : null,
    Date.now()
  );

  res.json({ ok: true, id });
});

// ============== ADMIN ==============
router.get('/', requireAuth, (req, res) => {
  const { status, limit = 100 } = req.query;
  let query = 'SELECT * FROM inquiries';
  const params = [];
  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(Math.min(parseInt(limit, 10) || 100, 500));
  const items = db.prepare(query).all(...params);
  res.json({ items });
});

router.patch('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!['new', 'contacted', 'scheduled', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
