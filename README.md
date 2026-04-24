# Vizhva

**Your portfolio. Live in 5 minutes.**

A SaaS portfolio builder by [GARI TECH](https://garitech.in). Sign up, pick a template, and get a professional portfolio live at `vizhva.me/yourname` — free forever.

---

## Features

- **10 templates** — 6 free (Editorial, Minimal, Bold, Card Grid, Terminal, Magazine) + 4 Pro (Glass, Neon, Timeline, Anime)
- **Drag-and-drop editor** — reorder sections, toggle visibility, set per-section colors and animations
- **13 content section types** — projects, experience, education, skills, testimonials, publications, books, and more
- **Real analytics** — view counts, 30-day sparkline, top countries, device breakdown, referrers (countries/devices/referrers require Pro)
- **Custom domain** — point your own domain via CNAME; DNS verification is automated (Pro)
- **Billing** — subscription management via Dodo Payments (checkout, billing portal, webhooks)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Zustand, React Router 7 |
| Styling | Tailwind CSS 4, CSS custom properties, inline styles |
| Auth | Clerk (`@clerk/react` + PyJWT RS256 verification) |
| Backend | FastAPI, Python 3.12, Uvicorn |
| Database | Supabase (PostgreSQL) — 16 tables, RLS enabled |
| Billing | Dodo Payments (HMAC-SHA256 webhooks) |
| Drag & drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Charts | Recharts |
| DNS | dnspython (CNAME chain verification) |
| Frontend hosting | Netlify |
| Backend hosting | Render (also: Koyeb, Railway, Docker) |

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.12
- [Clerk](https://clerk.com) account (free) — for auth
- [Supabase](https://supabase.com) project (free tier) — for database

### 1. Clone

```bash
git clone <repo-url>
cd vizhva
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in values (see below)
uvicorn main:app --reload --port 8000
# → http://localhost:8000
# → API docs: http://localhost:8000/docs
```

### 3. Frontend

```bash
cd frontend
npm install
# Create frontend/.env.local
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx" > .env.local
npm run dev
# → http://localhost:5173
```

> Vite automatically proxies `/api/*` to `http://127.0.0.1:8000` — no CORS config needed in development.

### 4. Database

Run these SQL migrations in order in your Supabase **SQL Editor**:

```
backend/supabase/migrations/001_init.sql      ← core schema (16 tables + RLS)
backend/supabase/migrations/003_new_sections.sql
backend/supabase/migrations/004_analytics_fn.sql  ← analytics aggregation function
backend/supabase/migrations/005_billing.sql
backend/supabase/migrations/006_add_lastname.sql
```

Then create two **Storage buckets** in your Supabase dashboard:

| Bucket name | Public | Max size |
|-------------|--------|----------|
| `avatars` | ✅ Yes | 5 MB |
| `project-images` | ✅ Yes | 10 MB |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key — used to auto-derive JWKS URL |
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | ✅ | Supabase service role key (bypasses RLS — keep secret) |
| `FRONTEND_URL` | ✅ | Frontend origin for CORS, e.g. `https://vizhva.me` (comma-separate for multiple) |
| `DODO_API_KEY` | Billing | Dodo Payments API key; set `skip` to disable billing |
| `DODO_PRODUCT_ID` | Billing | Dodo product ID for the Pro subscription |
| `DODO_WEBHOOK_SECRET` | Billing | HMAC-SHA256 webhook signing secret |
| `DODO_TEST_MODE` | — | `true` → sandbox API; `false` → live API (default: `true`) |
| `ALLOW_ALL_ORIGINS` | — | `true` → wildcard CORS (dev only, never in prod) |
| `CLERK_JWKS_URL` | — | Override auto-derived JWKS URL (optional) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key for `<ClerkProvider>` |
| `VITE_API_URL` | Production | Backend URL; leave empty in dev (Vite proxy handles it) |

---

## Project Structure

```
vizhva/
├── netlify.toml                  ← Frontend build config + SPA redirect
├── render.yaml                   ← Backend deploy config (Render)
├── Dockerfile                    ← Backend Docker image (backend/)
│
├── backend/
│   ├── main.py                   ← FastAPI app, CORS, router registration
│   ├── dependencies.py           ← Clerk JWT verification + Supabase singleton
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── profile.py            ← Profile CRUD, username, avatar upload, public portfolio
│   │   ├── projects.py           ← Project CRUD + image upload
│   │   ├── sections.py           ← All 9 section types + order/visibility/settings
│   │   ├── skills.py             ← Skills + social links
│   │   ├── analytics.py          ← View recording (rate-limited) + analytics RPC
│   │   ├── billing.py            ← Dodo checkout, portal, webhook handler
│   │   └── domain.py             ← CNAME verification for custom domains
│   ├── supabase/migrations/      ← SQL migration files (run in order)
│   └── tests/                    ← pytest suite (no live credentials needed)
│
└── frontend/
    ├── vite.config.js            ← Vite config + /api proxy
    ├── src/
    │   ├── main.jsx              ← React root, ClerkProvider
    │   ├── App.jsx               ← Routes (lazy-loaded pages)
    │   ├── api/                  ← Axios wrappers, one file per domain
    │   ├── store/                ← Zustand stores (editor, profile)
    │   ├── pages/                ← LandingPage, EditorPage, AnalyticsPage, SettingsPage,
    │   │                            PublicPortfolioPage, LoginPage, SignupPage
    │   ├── components/
    │   │   ├── editor/           ← OnboardingFlow, EditorForm, PortfolioPreview, SectionPanel
    │   │   └── layout/           ← DashboardLayout (sidebar + auth shell)
    │   └── templates/            ← 10 portfolio template components
    └── public/
        └── _redirects            ← Netlify SPA fallback
```

---

## Deployment

### Frontend → Netlify

`netlify.toml` is pre-configured. Connect the repo and set:

```
Build command:     cd frontend && npm run build
Publish directory: frontend/dist
```

Environment variables to add in Netlify dashboard:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_URL` (your Render backend URL)

### Backend → Render

`render.yaml` is pre-configured. Connect the repo or set manually:

```
Root directory:  backend
Build command:   pip install -r requirements.txt
Start command:   uvicorn main:app --host 0.0.0.0 --port $PORT
Health check:    /health
```

Add all backend environment variables in the Render dashboard.

### Backend → Docker

```bash
cd backend
docker build -t vizhva-api .
docker run -p 8000:8000 \
  -e CLERK_PUBLISHABLE_KEY=pk_live_xxx \
  -e SUPABASE_URL=https://xxx.supabase.co \
  -e SUPABASE_SERVICE_KEY=eyJ... \
  -e FRONTEND_URL=https://vizhva.me \
  vizhva-api
```

---

## Running Tests

```bash
cd backend
pytest              # all tests
pytest -v           # verbose
```

Tests use FastAPI's `TestClient` with dependency overrides — no live Supabase or Clerk credentials required.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes and add tests if applicable
4. Open a pull request

Please keep PRs focused — one feature or fix per PR.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built with FastAPI, React, and Supabase. A product from [GARI TECH](https://garitech.in).*
