import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db/init.js';

import authRoutes from './routes/auth.js';
import mediaRoutes from './routes/media.js';
import seoRoutes from './routes/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust the reverse proxy (Nginx) so req.ip + secure cookies work behind LB
app.set('trust proxy', 1);

// Security
app.use(helmet({
  contentSecurityPolicy: false, // CSP set at Nginx level
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Init DB (synchronous with better-sqlite3)
initDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/seo', seoRoutes);

// Health check (also exposed via Nginx)
app.get('/api/healthz', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// 404
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`✓ Backend listening on 127.0.0.1:${PORT}`);
});
