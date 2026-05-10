# Dr. Nagla ElSalawy — Editorial Wellness Website

Production-ready React + Node.js application designed for **Oracle Cloud Infrastructure (OCI) Compute (Oracle Linux 9)** behind an **OCI Load Balancer with SSL termination**.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + React Router (SPA, code-split, prerendered SEO meta) |
| Backend | Node.js 20 + Express + better-sqlite3 |
| Auth | JWT (admin only, accessed via `/admin` URL — no public link) |
| Storage | Local volume `/app/uploads` (images + videos), database `/app/data/db.sqlite` |
| Reverse Proxy | Nginx (inside container) — serves static React build + proxies `/api` to Node |
| Containerization | Docker + docker-compose |
| Future | Database can migrate to Oracle Autonomous DB / Postgres; uploads to OCI Object Storage |

---

## Quick deploy on OCI (Oracle Linux 9)

### 1. Provision a Compute instance
- Shape: `VM.Standard.A1.Flex` (Ampere) or `VM.Standard.E4.Flex` — 2 OCPU, 8GB RAM is enough.
- Image: **Oracle Linux 9**.
- Open ports `80` and `443` in your VCN security list (or NSG). Port 80 is what the OCI Load Balancer will hit; SSL is terminated at the LB.

### 2. Install Docker on the instance
```bash
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker opc
# log out and back in
```

### 3. Upload and extract
```bash
scp drnagla.tar.gz opc@<your-instance-ip>:~
ssh opc@<your-instance-ip>
tar -xzf drnagla.tar.gz
cd drnagla
```

### 4. Create the production env file
```bash
cp .env.example .env
nano .env
# Set ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET, PUBLIC_URL
```

### 5. Build and run
```bash
docker compose up -d --build
```

The site is now serving on port `80` of the instance. Point your **OCI Load Balancer** backend set at `<instance-private-ip>:80`. Configure the LB listener on `443` with your SSL certificate. Done.

### 6. (One-off) seed initial admin
The app auto-creates an admin user on first boot using `ADMIN_USERNAME` / `ADMIN_PASSWORD` from your env. Visit `https://yourdomain.com/admin` to log in.

---

## Local development

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
# opens http://localhost:5173 with proxy to backend on :3001
```

---

## Folder layout

```
drnagla/
├── docker-compose.yml          # Production orchestration
├── Dockerfile                  # Multi-stage: builds React, runs Node + Nginx
├── .env.example                # Template for production env vars
├── nginx/
│   └── nginx.conf              # Serves React + proxies /api + cache headers
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── pages/              # Home, Admin, BookingComing
│   │   ├── components/         # Sections, MediaGallery, AdminPanel, etc.
│   │   ├── lib/                # api.js (fetch wrapper)
│   │   └── styles/             # Editorial Wellness CSS
│   ├── index.html              # SEO meta + JSON-LD structured data
│   ├── public/
│   │   ├── robots.txt          # Allows GoogleBot, GPTBot, ClaudeBot, etc.
│   │   └── sitemap.xml
│   └── vite.config.js
└── backend/                    # Express API
    ├── server.js               # Entry point
    ├── routes/
    │   ├── auth.js             # POST /api/auth/login
    │   ├── media.js            # GET/POST/DELETE /api/media
    │   ├── inquiries.js        # POST /api/inquiries (booking form)
    │   └── seo.js              # /sitemap.xml, /robots.txt fallback
    ├── middleware/
    │   └── auth.js             # JWT verification
    ├── db/
    │   └── init.js             # SQLite schema + seed
    └── package.json
```

---

## SEO & LLM-discoverability

- Server-rendered `<title>`, `<meta description>`, Open Graph, Twitter cards.
- **JSON-LD structured data** (`MedicalBusiness` + `Person`) baked into `index.html` — Google rich results AND LLM crawlers parse this.
- `robots.txt` explicitly allows `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Bingbot`.
- `sitemap.xml` auto-generated, served at root.
- Semantic HTML5 throughout (`<article>`, `<section>`, `<nav>`).
- Public-facing routes are crawlable; `/admin` is `noindex`.

---

## Admin (`/admin`)

- Reachable only by typing the URL — no link from the public site.
- Login form → JWT cookie → upload images + videos, manage gallery items, view inquiries.
- Drag-and-drop multi-file upload with auto-thumbnails.
- Future hooks already wired: `/api/appointments`, `/api/meal-plans` endpoints stubbed for later expansion.

---

## OCI Load Balancer notes

The container exposes **HTTP only on port 80**. Your OCI LB:
- Listener: `HTTPS:443` with your SSL cert
- Backend set: instance on `HTTP:80` (LB does SSL termination)
- Health check: `GET /healthz` (returns 200 OK)

Nginx inside the container reads `X-Forwarded-Proto` so the app knows it's behind HTTPS.
