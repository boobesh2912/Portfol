import { useState, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'

const EditorialTemplate = lazy(() => import('../templates/EditorialTemplate'))
const MinimalTemplate   = lazy(() => import('../templates/MinimalTemplate'))
const BoldTemplate      = lazy(() => import('../templates/BoldTemplate'))
const CardGridTemplate  = lazy(() => import('../templates/CardGridTemplate'))
const TerminalTemplate  = lazy(() => import('../templates/TerminalTemplate'))
const MagazineTemplate  = lazy(() => import('../templates/MagazineTemplate'))
const AnimeEditorialTemplate = lazy(() => import('../templates/AnimeEditorialTemplate'))
const GlassTemplate     = lazy(() => import('../templates/GlassTemplate'))
const TimelineTemplate  = lazy(() => import('../templates/TimelineTemplate'))
const NeonTemplate      = lazy(() => import('../templates/NeonTemplate'))

// CHANGE 5: locale-based pricing
function useLocale() {
  const lang = navigator.language || ''
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  const isINR = lang === 'en-IN' || tz === 'Asia/Kolkata'
  return { isINR, proPrice: isINR ? '₹499' : '$9', teamsPrice: isINR ? '₹9,999' : '$299' }
}

const FEATURES = [
  { icon: '⚡', title: 'Live in 5 minutes', desc: 'Fill a form. Pick a look. Share the link. No code, no config, no waiting.' },
  { icon: '✦', title: 'Drag & Drop Editor', desc: 'Reorder sections, toggle visibility, edit inline. Your portfolio, your way.' },
  { icon: '◎', title: 'Real Analytics', desc: "See who's viewing your portfolio — countries, devices, referrers, trends." },
  { icon: '◈', title: '10 Stunning Templates', desc: 'Minimal, Bold, Card Grid, Terminal, Magazine, Editorial, Glass, Neon, Timeline, Anime.' },
  { icon: '⊞', title: 'Custom Domain', desc: 'Bring your own domain. DNS setup guided step by step. SSL included.' },
  { icon: '◻', title: 'Always Free Core', desc: 'Full portfolio, all sections, public URL — free forever. No credit card needed.' },
]

const FAQS = [
  { q: 'Is it really free?', a: "Yes. The free tier is fully functional — your portfolio lives at vizhva.app/yourname forever, with all sections and templates. No credit card needed." },
  { q: 'Can I use my own domain?', a: "Yes, with Pro. Add a CNAME record in your DNS and we handle SSL automatically via Let's Encrypt." },
  { q: 'How fast will my portfolio load?', a: 'Very fast. Public portfolio pages are statically rendered with no heavy JS. Under 500ms on most connections.' },
  { q: 'What goes in a portfolio?', a: 'Name, tagline, bio, skills, projects (with images and links), experience, education, services, testimonials, and more.' },
  { q: 'Can I take it offline?', a: 'Yes. You can set your portfolio to private at any time from your dashboard settings.' },
]

const DEMO_DATA = {
  profile: {
    id: 'demo', username: 'alex', full_name: 'Alex Rivera',
    tagline: 'Full Stack Developer · Open to work',
    bio: 'I build fast, accessible web apps. Passionate about developer tools and open source.',
    avatar_url: '', template: 'editorial', is_public: true, is_pro: false,
  },
  skills: [
    { id: '1', name: 'React' }, { id: '2', name: 'TypeScript' },
    { id: '3', name: 'FastAPI' }, { id: '4', name: 'PostgreSQL' }, { id: '5', name: 'Docker' },
  ],
  projects: [
    { id: 'p1', title: 'Portfolio Builder', description: 'No-code portfolio builder with live preview and 10 templates.', url: '#' },
    { id: 'p2', title: 'API Gateway', description: 'High-performance REST API gateway with rate limiting and auth.', url: '#' },
    { id: 'p3', title: 'LLM Pipeline', description: 'Production RAG pipeline using LangChain and Pinecone.', url: '#' },
  ],
  socialLinks: [
    { id: 's1', platform: 'github', url: 'https://github.com' },
    { id: 's2', platform: 'linkedin', url: 'https://linkedin.com' },
  ],
  sectionOrder: ['hero', 'about', 'skills', 'projects', 'contact'],
  hiddenSections: [], experiences: [], educations: [], certifications: [],
  services: [], testimonials: [], books: [], publications: [], quotes: [], customSections: [],
  sectionSettings: {},
}

// CHANGE 3: all 9 templates with Pro badges
const TEMPLATE_LIST = [
  { key: 'editorial', label: 'Editorial',       desc: 'Warm serif, amber accents',          pro: false },
  { key: 'minimal',   label: 'Minimal',         desc: 'Clean white canvas, Georgia serif',  pro: false },
  { key: 'bold',      label: 'Bold',            desc: 'Dark background, big typography',    pro: false },
  { key: 'cardgrid',  label: 'Card Grid',       desc: 'Light masonry, hover effects',       pro: false },
  { key: 'terminal',  label: 'Terminal',        desc: 'Green-on-dark hacker style',         pro: false },
  { key: 'magazine',  label: 'Magazine',        desc: 'Numbered editorial layout',          pro: false },
  { key: 'anime',     label: 'Anime Editorial', desc: 'Soft pastel colors, playful',        pro: true  },
  { key: 'glass',     label: 'Glass',           desc: 'Frosted glass, purple gradient',     pro: true  },
  { key: 'timeline',  label: 'Timeline',        desc: 'Vertical CV timeline, clean',        pro: true  },
  { key: 'neon',      label: 'Neon',            desc: 'Dark bg, electric glow effects',     pro: true  },
]

function LivePreview({ templateKey }) {
  const props = { ...DEMO_DATA }
  switch (templateKey) {
    case 'editorial': return <EditorialTemplate {...props} />
    case 'minimal':   return <MinimalTemplate {...props} />
    case 'bold':      return <BoldTemplate {...props} />
    case 'cardgrid':  return <CardGridTemplate {...props} />
    case 'terminal':  return <TerminalTemplate {...props} />
    case 'magazine':  return <MagazineTemplate {...props} />
    case 'anime':     return <AnimeEditorialTemplate {...props} />
    case 'glass':     return <GlassTemplate {...props} />
    case 'timeline':  return <TimelineTemplate {...props} />
    case 'neon':      return <NeonTemplate {...props} />
    default:          return <MinimalTemplate {...props} />
  }
}

// CHANGE 6: B2B audience cards
const B2B_CARDS = [
  {
    icon: '🎓',
    title: 'Bootcamp Grads',
    desc: 'Stand out in a crowded job market. Show your projects and skills with a portfolio that looks professional from day one.',
    cta: 'Get hired faster',
  },
  {
    icon: '💼',
    title: 'Freelancers',
    desc: 'Win more clients. Replace scattered links with a single, polished portfolio that converts visitors into paying customers.',
    cta: 'Win more clients',
  },
  {
    icon: '🚀',
    title: 'Job Seekers',
    desc: 'Recruiters spend 6 seconds on a resume. Give them a living portfolio that makes those seconds count.',
    cta: 'Impress recruiters',
  },
]

const S = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 48px', borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0,
    background: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(12px)',
    zIndex: 50,
  },
  logo: {
    fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600,
    color: 'var(--text-heading)', fontStyle: 'italic', letterSpacing: -0.5,
  },
  pill: {
    display: 'inline-block', fontSize: 11, fontWeight: 500, letterSpacing: 2,
    textTransform: 'uppercase', color: 'var(--accent)', padding: '5px 16px',
    border: '1px solid rgba(200,136,74,0.3)', borderRadius: 100,
    background: 'rgba(200,136,74,0.06)', marginBottom: 24,
  },
  btnPrimary: {
    display: 'inline-block', background: 'var(--text-heading)', color: '#fff',
    fontSize: 14, fontWeight: 600, padding: '13px 32px', borderRadius: 8,
    textDecoration: 'none', transition: 'opacity .2s',
  },
  btnOutline: {
    display: 'inline-block', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 14, padding: '13px 28px',
    borderRadius: 8, textDecoration: 'none', background: 'transparent',
  },
  card: {
    background: 'var(--bg-card)', borderRadius: 14, padding: '28px 24px',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
  },
  label: {
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em',
    textTransform: 'uppercase', color: 'var(--text-muted)',
    display: 'block', marginBottom: 14,
  },
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [activeTemplate, setActiveTemplate] = useState('editorial')
  const [modalTemplate, setModalTemplate] = useState(null)
  const { isINR, proPrice, teamsPrice } = useLocale()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>

      {/* Full-screen template preview modal — CHANGE 3 */}
      {modalTemplate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column' }}
          onClick={() => setModalTemplate(null)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text-heading)' }}>
                {TEMPLATE_LIST.find(t => t.key === modalTemplate)?.label}
              </span>
              {TEMPLATE_LIST.find(t => t.key === modalTemplate)?.pro && (
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '.06em', color: '#92400e', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 4, padding: '2px 6px' }}>PRO</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link to="/signup" style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: 'var(--accent)', padding: '7px 18px', borderRadius: 7, textDecoration: 'none' }}>Use this template →</Link>
              <button onClick={() => setModalTemplate(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1, padding: '0 4px' }}>×</button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', background: '#fff' }} onClick={e => e.stopPropagation()}>
            <Suspense fallback={<div style={{ padding: 60, textAlign: 'center', color: '#aaa' }}>Loading…</div>}>
              <LivePreview templateKey={modalTemplate} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={S.nav}>
        <span style={S.logo}>Vizhva</span>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#features" style={{ fontSize: 13, color: 'var(--text)', fontWeight: 400 }}>Features</a>
          <a href="#pricing" style={{ fontSize: 13, color: 'var(--text)', fontWeight: 400 }}>Pricing</a>
          <Link to="/login" style={{ fontSize: 13, color: 'var(--text)', fontWeight: 400 }}>Log in</Link>
          <Link to="/signup" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--text-heading)', padding: '8px 20px', borderRadius: 8, textDecoration: 'none' }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '110px 48px 90px', textAlign: 'center', maxWidth: 960, margin: '0 auto' }}>
        <div style={S.pill}>Free forever · No credit card</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 7vw, 88px)', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1.04, letterSpacing: -2, marginBottom: 24 }}>
          Your portfolio.<br />
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Live in 5 minutes.</em>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 300 }}>
          Fill a form, pick a template, share the link. No code. No credit card. Your professional portfolio at{' '}
          <span style={{ color: 'var(--text-heading)', fontWeight: 500 }}>{window.location.host}/yourname</span>.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" style={S.btnPrimary}>Get started free →</Link>
          <a href="#templates" style={S.btnOutline}>See templates</a>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ padding: '28px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-warm)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {[['10', 'Templates'], ['∞', 'Free forever'], ['< 5min', 'To go live'], ['0', 'Code needed']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '.1em' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* B2B section — CHANGE 6 */}
      <section style={{ padding: '96px 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={S.label}>Who it's for</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 12 }}>
              Built for people who ship
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>Whether you're landing your first job, growing a freelance practice, or switching careers — Vizhva gives you the edge.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {B2B_CARDS.map(card => (
              <div key={card.title} style={{ ...S.card, textAlign: 'left', padding: '32px 28px' }}>
                <div style={{ fontSize: 36, marginBottom: 18 }}>{card.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 10 }}>{card.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.75, marginBottom: 20 }}>{card.desc}</div>
                <Link to="/signup" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '.06em', fontWeight: 600 }}>
                  {card.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '96px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <span style={S.label}>How it works</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 64 }}>
            Three steps to live
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {[
              { step: '01', title: 'Fill the form', desc: 'Name, bio, skills, projects. Takes 3 minutes. Skip anything you want to add later.' },
              { step: '02', title: 'Pick a template', desc: 'Choose from 10 beautiful templates. Switch anytime — your data stays intact.' },
              { step: '03', title: 'Go live', desc: 'Your portfolio is instantly live at your Vizhva URL. Share the link anywhere.' },
            ].map(item => (
              <div key={item.step} style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 600, color: 'var(--border)', marginBottom: 18, lineHeight: 1 }}>{item.step}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 10 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '96px 48px', background: 'var(--bg-warm)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={S.label}>Features</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: 'var(--text-heading)' }}>
              Everything you need
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ ...S.card, background: 'var(--bg-card)' }}>
                <div style={{ fontSize: 20, marginBottom: 14, color: 'var(--accent)' }}>{f.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template gallery — CHANGE 3 */}
      <section id="templates" style={{ padding: '96px 0 96px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px', textAlign: 'center', marginBottom: 48 }}>
          <span style={S.label}>Templates</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 12 }}>
            Pick your look
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>6 free templates + 4 Pro-exclusive designs. Switch anytime from your dashboard.</p>
        </div>

        {/* Template tab selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', padding: '0 48px', marginBottom: 32 }}>
          {TEMPLATE_LIST.map(t => (
            <button key={t.key} onClick={() => setActiveTemplate(t.key)} style={{
              padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6,
              border: activeTemplate === t.key ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: activeTemplate === t.key ? 'rgba(200,136,74,.08)' : 'var(--bg-card)',
              color: activeTemplate === t.key ? 'var(--accent)' : 'var(--text)',
            }}>
              {t.label}
              {t.pro && <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '.06em', color: '#92400e', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 3, padding: '1px 4px' }}>PRO</span>}
            </button>
          ))}
        </div>

        {/* Live preview window */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,.1)' }}>
            {/* Browser chrome */}
            <div style={{ background: 'var(--bg-card)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ flex: 1, background: 'var(--bg-warm)', borderRadius: 5, padding: '4px 12px', fontSize: 11, color: 'var(--text-muted)', marginLeft: 10, maxWidth: 220, fontFamily: 'var(--font-mono)' }}>
                {window.location.host}/alex
              </div>
              <button onClick={() => setModalTemplate(activeTemplate)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '.08em',
                background: 'none', border: '1px solid rgba(200,136,74,.3)', borderRadius: 5,
                padding: '3px 10px', cursor: 'pointer',
              }}>Preview full screen ↗</button>
            </div>
            {/* Scaled template preview */}
            <div style={{ height: 480, overflow: 'hidden', position: 'relative', background: '#fff' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, transformOrigin: 'top left', transform: 'scale(0.6)', width: '166.67%', pointerEvents: 'none' }}>
                <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontSize: 12 }}>Loading preview…</div>}>
                  <LivePreview templateKey={activeTemplate} />
                </Suspense>
              </div>
            </div>
            {/* CTA bar */}
            <div style={{ background: 'var(--bg-card)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {TEMPLATE_LIST.find(t => t.key === activeTemplate)?.desc}
                {TEMPLATE_LIST.find(t => t.key === activeTemplate)?.pro && (
                  <span style={{ marginLeft: 8, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#92400e', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 3, padding: '1px 5px' }}>PRO</span>
                )}
              </span>
              <Link to="/signup" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
                Use this template →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — CHANGE 5 (locale) + CHANGE 7 (3 tiers) */}
      <section id="pricing" style={{ padding: '96px 48px', background: 'var(--bg-warm)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <span style={S.label}>Pricing</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 12 }}>
            Simple, honest pricing
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 56, fontSize: 14 }}>Free forever. Upgrade when you need more.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>

            {/* Starter (Free) */}
            <div style={{ ...S.card, textAlign: 'left', padding: 32 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Starter</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 600, color: 'var(--text-heading)', margin: '8px 0 2px', lineHeight: 1 }}>$0</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 24 }}>forever</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {['Full portfolio', 'All 14 sections', 'Your Vizhva URL', 'Basic analytics', '6 free templates', '"Built with Vizhva" badge'].map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', gap: 10 }}>
                    <span style={{ color: 'var(--success)' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" style={{ display: 'block', textAlign: 'center', border: '1px solid var(--border)', color: 'var(--text-heading)', padding: '10px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div style={{ ...S.card, textAlign: 'left', padding: 32, border: '1px solid rgba(200,136,74,.4)', background: 'rgba(200,136,74,.03)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent)', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderBottomLeftRadius: 8, color: '#fff', letterSpacing: 1 }}>POPULAR</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Pro</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 600, color: 'var(--text-heading)', margin: '8px 0 2px', lineHeight: 1 }}>{proPrice}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: isINR ? 4 : 24 }}>
                /month{isINR && <span style={{ marginLeft: 6, opacity: 0.6 }}>≈ $9 USD</span>}
              </div>
              {isINR && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', opacity: 0.55, marginBottom: 24 }}>Billed in USD at checkout</div>}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {['Everything in Starter', 'Custom domain + SSL', 'Advanced analytics', '4 Pro-exclusive templates', 'Remove branding', 'Priority support'].map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', gap: 10 }}>
                    <span style={{ color: 'var(--accent)' }}>✦</span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" style={{ display: 'block', textAlign: 'center', background: 'var(--text-heading)', color: '#fff', padding: '10px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>
                Get Pro
              </Link>
            </div>

            {/* Teams */}
            <div style={{ ...S.card, textAlign: 'left', padding: 32 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Teams</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 600, color: 'var(--text-heading)', margin: '8px 0 2px', lineHeight: 1 }}>{teamsPrice}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 24 }}>
                /month{isINR && <span style={{ marginLeft: 6, opacity: 0.6 }}>≈ $299 USD</span>}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {['Everything in Pro', 'Up to 50 members', 'Team admin dashboard', 'Bulk onboarding', 'White-label option', 'Dedicated support'].map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', gap: 10 }}>
                    <span style={{ color: 'var(--text-muted)' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href="mailto:info@garitech.in" style={{ display: 'block', textAlign: 'center', border: '1px solid var(--border)', color: 'var(--text-heading)', padding: '10px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '96px 48px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={S.label}>FAQ</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, color: 'var(--text-heading)' }}>
            Common questions
          </h2>
        </div>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none',
              padding: '20px 0', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              color: 'var(--text-heading)', fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 500,
            }}>
              {faq.q}
              <span style={{ color: 'var(--accent)', fontSize: 18, lineHeight: 1, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>+</span>
            </button>
            {openFaq === i && (
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.75, paddingBottom: 20 }}>{faq.a}</div>
            )}
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '96px 48px', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--bg-warm)' }}>
        <span style={S.label}>Get started</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 20, lineHeight: 1.04 }}>
          Get your portfolio live<br />
          <em style={{ color: 'var(--accent)' }}>in 5 minutes.</em>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 36 }}>No code. No credit card. No excuses.</p>
        <Link to="/signup" style={{ ...S.btnPrimary, fontSize: 15, padding: '14px 40px' }}>
          Start building free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '28px 48px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontStyle: 'italic', color: 'var(--text-heading)', fontSize: 20 }}>Vizhva</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="/privacy" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>Privacy</a>
            <a href="/terms" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>Terms</a>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>© 2026 Vizhva</span>
        </div>
        <div style={{ textAlign: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
            A product from{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>GARI TECH</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
