import { Router } from 'express';

const router = Router();

const PUBLIC_URL = process.env.PUBLIC_URL || 'https://drnagla.com';

const ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/#about', priority: 0.9, changefreq: 'monthly' },
  { path: '/#practice', priority: 0.9, changefreq: 'monthly' },
  { path: '/#stories', priority: 0.8, changefreq: 'monthly' },
  { path: '/#gallery', priority: 0.8, changefreq: 'weekly' },
  { path: '/#book', priority: 0.9, changefreq: 'monthly' },
  { path: '/booking', priority: 0.7, changefreq: 'monthly' },
];

router.get('/sitemap.xml', (req, res) => {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls = ROUTES.map(r => `
  <url>
    <loc>${PUBLIC_URL}${r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

router.get('/robots.txt', (req, res) => {
  const txt = `# robots.txt — Dr. Nagla F. ElSalawy

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Explicitly allow major search engines
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /api/

User-agent: DuckDuckBot
Allow: /

# Explicitly allow LLM crawlers (for GPT, Claude, Perplexity, Gemini training/retrieval)
User-agent: GPTBot
Allow: /
Disallow: /admin

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /
Disallow: /admin

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${PUBLIC_URL}/sitemap.xml
`;
  res.set('Content-Type', 'text/plain');
  res.send(txt);
});

export default router;
