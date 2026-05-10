import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { getDb } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const db = getDb();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const MAX_MB = parseInt(process.env.MAX_UPLOAD_MB || '200', 10);
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(path.join(UPLOAD_DIR, 'thumbs'), { recursive: true });

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO = ['video/mp4', 'video/webm', 'video/quicktime'];

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const id = nanoid(12);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if ([...ALLOWED_IMAGE, ...ALLOWED_VIDEO].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

// ============== PUBLIC ==============
// GET /api/media — list media for the public gallery
router.get('/', (req, res) => {
  const { category, limit = 50 } = req.query;
  let query = 'SELECT * FROM media';
  const params = [];
  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }
  query += ' ORDER BY featured DESC, sort_order ASC, created_at DESC LIMIT ?';
  params.push(Math.min(parseInt(limit, 10) || 50, 200));
  const items = db.prepare(query).all(...params);
  res.json({ items });
});

// ============== ADMIN ==============
// POST /api/media — upload one or more files
router.post('/', requireAuth, upload.array('files', 20), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const { title = '', caption = '', category = 'general', featured = '0' } = req.body || {};
  const created = [];

  for (const file of req.files) {
    const id = nanoid(12);
    const isVideo = ALLOWED_VIDEO.includes(file.mimetype);
    const type = isVideo ? 'video' : 'image';
    let thumbnail = null;

    // Generate thumbnail for images
    if (!isVideo) {
      const thumbName = `thumb-${file.filename.replace(path.extname(file.filename), '.webp')}`;
      const thumbPath = path.join(UPLOAD_DIR, 'thumbs', thumbName);
      try {
        await sharp(file.path)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(thumbPath);
        thumbnail = `thumbs/${thumbName}`;
      } catch (e) {
        console.warn('Thumbnail failed:', e.message);
      }
    }

    const itemTitle = title || file.originalname.replace(path.extname(file.originalname), '');
    const now = Date.now();

    db.prepare(`
      INSERT INTO media (id, type, filename, thumbnail, title, caption, category, featured, sort_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, type, file.filename, thumbnail, itemTitle, caption, category, featured === '1' ? 1 : 0, 0, now);

    created.push({
      id, type, filename: file.filename, thumbnail,
      title: itemTitle, caption, category, featured: featured === '1' ? 1 : 0, created_at: now,
    });
  }

  res.json({ items: created });
});

// PATCH /api/media/:id — update metadata
router.patch('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { title, caption, category, featured, sort_order } = req.body || {};
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(id);
  if (!item) return res.status(404).json({ error: 'Not found' });

  db.prepare(`
    UPDATE media SET
      title = COALESCE(?, title),
      caption = COALESCE(?, caption),
      category = COALESCE(?, category),
      featured = COALESCE(?, featured),
      sort_order = COALESCE(?, sort_order)
    WHERE id = ?
  `).run(title, caption, category, featured, sort_order, id);

  res.json({ item: db.prepare('SELECT * FROM media WHERE id = ?').get(id) });
});

// DELETE /api/media/:id
router.delete('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(id);
  if (!item) return res.status(404).json({ error: 'Not found' });

  // Delete files
  try {
    fs.unlinkSync(path.join(UPLOAD_DIR, item.filename));
    if (item.thumbnail) fs.unlinkSync(path.join(UPLOAD_DIR, item.thumbnail));
  } catch (e) { /* ignore */ }

  db.prepare('DELETE FROM media WHERE id = ?').run(id);
  res.json({ ok: true });
});

export default router;
