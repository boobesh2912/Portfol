# Portfol

**Your portfolio. Live in 5 minutes.**

Portfol is a form-first portfolio builder SaaS. Fill a form, pick a template, and get a professional portfolio live at `portfol.me/yourname` — for free.

---

## What it is

- **Free tier**: Full portfolio at `portfol.me/username`, all sections, 3 templates, basic analytics
- **Pro tier** ($5/mo): Custom domain, advanced analytics, remove branding, 2 extra templates
- **Stack**: Vite + React + Tailwind (frontend), FastAPI + Python (backend), Supabase (auth + DB + storage), Dodo Payments (billing)

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- A Supabase project (free tier works)

### 1. Clone & install

```bash
git clone <repo-url>
cd portfol
```

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env
# Fill in .env values (see Environment Variables below)
npm install
npm run dev
# Runs at http://localhost:5173
```

### 3. Backend setup

```bash
cd backend
cp .env.example .env
# Fill in .env values
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Runs at http://localhost:8000
```

> **Windows note:** `source` does not exist in PowerShell/CMD. Skip the venv or use
> `.\venv\Scripts\Activate.ps1` (PowerShell) / `venv\Scripts\activate.bat` (CMD).
> If you have multiple Python versions, run `py -3.11 -m pip install -r requirements.txt`
> to target Python 3.11 specifically.

The frontend Vite dev server proxies `/api` → `http://localhost:8000` automatically.

---

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (empty in dev — Vite proxy handles it) |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_DODO_PRODUCT_ID` | Dodo Payments product ID (Phase 6) |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (from project settings) |
| `SUPABASE_JWT_SECRET` | JWT secret from Supabase (Settings → API → JWT Secret) |
| `DODO_API_KEY` | Dodo Payments API key (Phase 6) |
| `DODO_WEBHOOK_SECRET` | Dodo Payments webhook secret (Phase 6) |
| `DODO_PRODUCT_ID` | Dodo Payments product ID (Phase 6) |
| `FRONTEND_URL` | Frontend URL for CORS + redirects (e.g. `https://portfol.me`) |

---

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full migration:
   ```
   backend/supabase/migrations/001_init.sql
   ```
3. Create two **Storage buckets** (Storage tab):
   - `avatars` — Public read, authenticated write
   - `project-images` — Public read, authenticated write
4. Enable **Google OAuth** (optional) in Authentication → Providers
5. Copy your project URL, anon key, service role key, and JWT secret into your `.env` files

---

## Deployment

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Add all `VITE_*` environment variables
5. Deploy — Vercel auto-detects Vite

### Backend → Render

1. Push `backend/` to GitHub (or a monorepo)
2. Create a new **Web Service** on [render.com](https://render.com)
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all backend environment variables
6. Deploy

### DNS (Cloudflare)

1. Add your domain on Cloudflare (free plan)
2. Set CNAME `portfol.me` → your Vercel deployment URL
3. Set CNAME `api.portfol.me` → your Render backend URL (update `VITE_API_URL`)
4. Enable **Proxy** (orange cloud) on both

---

## Project Structure

```
portfol/
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios instance + resource files
│   │   ├── components/
│   │   │   ├── editor/   # EditorForm, SectionPanel, OnboardingFlow, PortfolioPreview
│   │   │   └── layout/   # DashboardLayout
│   │   ├── pages/        # LandingPage, LoginPage, SignupPage, EditorPage, AnalyticsPage, SettingsPage, PublicPortfolioPage
│   │   ├── store/        # Zustand stores (auth, profile, editor)
│   │   └── templates/    # MinimalTemplate, BoldTemplate, CardGridTemplate
│   ├── .env.example
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── main.py           # FastAPI app + CORS
│   ├── dependencies.py   # JWT auth + Supabase client
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── profile.py
│   │   ├── projects.py
│   │   ├── sections.py
│   │   ├── analytics.py
│   │   ├── domain.py
│   │   └── billing.py    # Stubs until Phase 6
│   └── supabase/
│       └── migrations/
│           └── 001_init.sql
│
└── PRD.md
```

---

## API

Base URL: `http://localhost:8000` (dev) or your Render URL (prod)

All authenticated routes require `Authorization: Bearer <supabase_access_token>`.

See [PRD.md](PRD.md) Section 9 for the full API reference.

---

## Billing (Phase 6)

Billing via Dodo Payments is scaffolded but inactive until Phase 6.  
To activate, provide `DODO_API_KEY`, `DODO_WEBHOOK_SECRET`, and `DODO_PRODUCT_ID`.

---

*Built with FastAPI, React, and Supabase. Designed to support 200+ users on $0/month infrastructure.*
