# PRD — Portfol
### *"Your portfolio. Live in 5 minutes."*

> **Product Name:** Portfol  
> **Domain:** `portfol.me` or `portfol.io` (low cost, ~$5–12/yr on Namecheap or Porkbun)  
> **Version:** v1.0  
> **Status:** Pre-build  
> **Author:** Founder  
> **Last Updated:** April 2026

---

## 1. Executive Summary

Portfol is a **form-first, drag-and-drop portfolio builder SaaS** that gets any developer, designer, or student live at `portfol.me/yourname` in under 5 minutes — for free. No code required. No credit card. No friction.

The free tier is fully functional. Revenue comes from users who want a **custom domain** and **advanced analytics** — paying $5/month to remove the `portfol.me` subdomain and get deeper insights.

---

## 2. Problem Statement

| Problem | Current Solution | Gap |
|---|---|---|
| Need a portfolio fast | Build from scratch | Takes days |
| No coding skills | Webflow / Framer | Too complex, too expensive |
| Just want a link to share | Linktree | Not a real portfolio |
| Want something professional | Squarespace | Overkill, $16+/mo |

**Core insight:** Most people don't need a website builder. They need a **portfolio publisher** — fill in your info, pick a look, go live. Done.

---

## 3. Target Users

### Primary
- **Developers** — need a portfolio for job applications, freelance work
- **Designers** — need to showcase visual work with images
- **Students** — need a presence when applying for internships or jobs

### Secondary
- Freelancers, writers, marketers — anyone who needs an online presence

### User Persona
> **Arjun, 22, CS student**  
> Applying for internships. Has GitHub projects but no website. Doesn't want to spend money or hours. Wants something that looks good and has his name on it.

---

## 4. Product Goals

| Goal | Metric | Target (3 months post-launch) |
|---|---|---|
| User signups | Total registered users | 200 |
| Active portfolios | Published portfolios | 150 |
| Paid conversions | Pro subscribers | 10 |
| MRR | Monthly Recurring Revenue | $50 |
| Avg. time to publish | From signup to live | < 5 minutes |

---

## 5. Core Features

### 5.1 Onboarding Flow (Form-First)
- Multi-step form on first login
- Fields: Full name, tagline, bio, profile photo, skills (tags), projects (name + description + link + image), social links (GitHub, LinkedIn, Twitter, website)
- User can skip any section and fill later
- Progress bar showing completion %
- Auto-saves every field on blur

### 5.2 Portfolio Editor (Drag and Drop)
- Sections: Hero, About, Skills, Projects, Experience, Contact
- Drag to reorder sections
- Toggle sections on/off (show/hide)
- Each section has an inline edit mode — click to edit, click away to save
- Live preview panel on the right (desktop) or toggle button (mobile)

### 5.3 Public Portfolio Page
- Hosted at `portfol.me/username`
- Username set during signup (alphanumeric, unique, 3–20 chars)
- Mobile responsive — works on all screen sizes
- Fast load — static render, no heavy JS
- SEO meta tags auto-generated (name, bio, skills as keywords)
- OG image auto-generated for social sharing
- Portfolio is public by default, can be set to private (free feature)

### 5.4 Templates
- 3 free templates at launch: **Minimal**, **Bold**, **Card Grid**
- Template switcher in editor — live preview before applying
- All templates are mobile-first
- Paid users unlock 2 additional premium templates

### 5.5 Analytics (Free Tier)
- Total portfolio views (all time)
- Views in last 7 days
- Simple sparkline chart

### 5.6 Analytics (Pro Tier)
- Views by country (world map heatmap)
- Referrer breakdown (where traffic comes from)
- Device type (mobile vs desktop)
- Daily/weekly/monthly view toggle
- Unique vs total visitors

### 5.7 Custom Domain (Pro Only)
- User enters their domain (e.g. `arjun.dev`)
- Dashboard shows DNS records to add (A record or CNAME)
- Auto SSL via Let's Encrypt
- Domain verification polling every 5 minutes
- Once verified, portfolio serves from custom domain

### 5.8 Pro — Remove Branding
- Free tier shows "Built with Portfol" in footer
- Pro removes this entirely

### 5.9 AI Generation (Coming Soon — v2)
- Upload resume (PDF) → AI fills all sections automatically
- Paste LinkedIn URL → AI scrapes and fills profile
- AI-written bio generator ("Write a bio for me")
- Shown as "Coming Soon" badge in the editor to build anticipation

---

## 6. Pages & Routes

### Public Routes
| Route | Description |
|---|---|
| `/` | Landing page — hero, features, pricing, CTA |
| `/:username` | Public portfolio page |
| `/login` | Login page |
| `/signup` | Signup page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Authenticated Routes
| Route | Description |
|---|---|
| `/dashboard` | Main dashboard — editor, analytics, settings |
| `/dashboard/editor` | Portfolio editor |
| `/dashboard/analytics` | Analytics page |
| `/dashboard/settings` | Account settings, custom domain, billing |

---

## 7. Tech Stack

### Frontend
| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO, free on Vercel |
| Styling | Tailwind CSS | Fast, consistent |
| Drag & Drop | `@dnd-kit/core` | Lightweight, accessible |
| State | Zustand | Simple, no boilerplate |
| Forms | React Hook Form | Performance |
| Auth UI | Supabase Auth UI | Pre-built, integrates with backend |

### Backend
| Layer | Choice | Reason |
|---|---|---|
| Framework | FastAPI (Python) | Founder preference, fast, async |
| Auth | Supabase Auth (JWT) | Free tier, handles 50k MAU |
| Database | Supabase PostgreSQL | Free tier, row-level security |
| File Storage | Supabase Storage | Profile photos, project images |
| Payments | Dodo Payments | MoR — handles global taxes, 150+ countries, no business entity needed |
| Custom Domain SSL | Let's Encrypt via `certbot` | Free SSL |
| OG Image Generation | `satori` or `Pillow` | Generate social preview images |

### Hosting (All Free Tier)
| Service | What it hosts | Free Limit |
|---|---|---|
| Vercel | Next.js frontend | 100GB bandwidth/mo |
| Render or Railway | FastAPI backend | 500 hrs/mo (Render free) |
| Supabase | DB + Auth + Storage | 500MB DB, 1GB storage, 50k MAU |
| Cloudflare | DNS + SSL proxy | Free forever |

**This stack supports 200+ users comfortably on $0/month infrastructure cost.**

---

## 8. Database Schema

```sql
-- Users table (extends Supabase auth.users)
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text UNIQUE NOT NULL,
  full_name text,
  tagline text,
  bio text,
  avatar_url text,
  is_pro boolean DEFAULT false,
  custom_domain text,
  domain_verified boolean DEFAULT false,
  template text DEFAULT 'minimal',
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Skills
skills (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES profiles,
  name text NOT NULL,
  order_index int DEFAULT 0
)

-- Projects
projects (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES profiles,
  title text NOT NULL,
  description text,
  url text,
  image_url text,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
)

-- Social links
social_links (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES profiles,
  platform text NOT NULL,  -- github, linkedin, twitter, etc
  url text NOT NULL
)

-- Section ordering
section_order (
  profile_id uuid REFERENCES profiles,
  sections text[] DEFAULT ARRAY['hero','about','skills','projects','contact']
)

-- Analytics
page_views (
  id uuid PRIMARY KEY,
  portfolio_username text NOT NULL,
  viewer_ip_hash text,  -- hashed for privacy
  country text,
  device_type text,
  referrer text,
  viewed_at timestamptz DEFAULT now()
)

-- Dodo Payments subscriptions
subscriptions (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES profiles,
  dodo_customer_id text,
  dodo_subscription_id text,
  status text,  -- active, cancelled, past_due, on_hold
  current_period_end timestamptz
)
```

---

## 9. API Endpoints (FastAPI)

### Auth
- Handled entirely by Supabase — no custom auth endpoints needed

### Profile
```
GET    /api/profile/:username        — Public portfolio data
GET    /api/profile/me               — Authenticated user's own profile
PUT    /api/profile/me               — Update profile
POST   /api/profile/me/avatar        — Upload avatar
DELETE /api/profile/me               — Delete account
```

### Projects
```
GET    /api/projects                 — List user's projects
POST   /api/projects                 — Create project
PUT    /api/projects/:id             — Update project
DELETE /api/projects/:id             — Delete project
POST   /api/projects/:id/image       — Upload project image
PUT    /api/projects/reorder         — Save drag-and-drop order
```

### Sections
```
PUT    /api/sections/order           — Save section order
PUT    /api/sections/visibility      — Toggle section on/off
```

### Analytics
```
POST   /api/analytics/view           — Record a portfolio view (called on public page load)
GET    /api/analytics/me             — Get analytics for authenticated user
```

### Domain
```
POST   /api/domain/connect           — Submit custom domain
GET    /api/domain/verify            — Check DNS verification status
DELETE /api/domain                   — Remove custom domain
```

### Billing
```
POST   /api/billing/checkout         — Create Dodo Payments checkout session
POST   /api/billing/portal           — Open Dodo Payments customer portal
POST   /api/billing/webhook          — Dodo Payments webhook (subscription events)
```

---

## 10. Monetization

### Pricing
| Plan | Price | Features |
|---|---|---|
| **Free** | $0/mo forever | Full portfolio, all sections, `portfol.me/username`, basic analytics, 3 templates |
| **Pro** | $5/mo | Custom domain, advanced analytics, remove branding, 2 premium templates, priority support |

### Dodo Payments Setup
- Dodo Payments Checkout for upgrade flow (supports 150+ countries, 80+ currencies out of the box)
- Dodo Payments Customer Portal for cancellation/billing management
- Webhook events to handle: `subscription.active`, `subscription.cancelled`, `subscription.on_hold`, `payment.failed`
- On successful payment → flip `is_pro = true` in DB
- On cancellation → flip `is_pro = false` at period end

---

## 11. Landing Page Structure

1. **Hero** — Headline + subheadline + CTA + portfolio preview mockup
2. **Social proof** — "Join X people who already have their portfolio live"
3. **How it works** — 3 steps: Fill form → Customize → Go live
4. **Features** — 6 feature cards with icons
5. **Templates** — Preview of 3 templates (interactive toggle)
6. **Pricing** — Free vs Pro comparison table
7. **FAQ** — 5–6 common questions
8. **Footer CTA** — "Get your portfolio live in 5 minutes"

---

## 12. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page load speed | < 2s on 4G mobile |
| Uptime | 99.5%+ |
| Portfolio URL response | < 500ms |
| Analytics write latency | Non-blocking (fire and forget) |
| Data privacy | No raw IPs stored (hash viewer IPs) |
| GDPR compliance | Cookie-free analytics, privacy policy |
| Security | Supabase RLS on all tables, HTTPS only |

---

## 13. Constraints

- **Infrastructure budget:** $0/month until revenue (all free tiers)
- **Team size:** Solo founder
- **Timeline:** MVP in 3–4 weeks
- **No mobile app** in v1 — web only, mobile responsive

---

## 14. Out of Scope (v1)

- Mobile app
- Team/agency portfolios
- AI generation (v2)
- Blog section
- Password-protected portfolios
- Portfolio themes marketplace
- Embed widgets

---

## 15. V1 Launch Checklist

- [ ] Supabase project setup (DB + Auth + Storage)
- [ ] FastAPI backend scaffolded and deployed on Render
- [ ] Next.js frontend scaffolded and deployed on Vercel
- [ ] Signup → onboarding form → portfolio live flow working
- [ ] 3 templates built and switchable
- [ ] Drag and drop section reordering
- [ ] Public portfolio page at `/username`
- [ ] Basic analytics (view count)
- [ ] Stripe integration (checkout + webhook)
- [ ] Custom domain flow (submit → DNS instructions → verify)
- [ ] Landing page live
- [ ] Privacy policy + Terms of service pages
- [ ] Mobile responsive on all pages
- [ ] Domain purchased and configured on Cloudflare

---

## 16. Success Metrics (3 Months Post-Launch)

| Metric | Target |
|---|---|
| Total users | 200 |
| Published portfolios | 150 |
| Pro subscribers | 10 |
| MRR | $50 |
| Churn rate | < 20%/mo |
| Avg. session duration | > 3 minutes |

---

*This PRD is the single source of truth for v1 of Portfol. Any AI tool, developer, or collaborator reading this should have full context to understand, build, and extend this product.*