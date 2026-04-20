/* Bold — Dark full-page hero, fixed top navbar, gradient accent, big typography. */

const C = {
  bg: '#0a0a0f', bgCard: '#111118', bgElev: '#16161f',
  border: '#1e1e2e', text: '#a0a0b8', head: '#e8e8f0', mute: '#5a5a78',
  accent: '#7c5cfc', accentGlow: 'rgba(124,92,252,0.2)',
}
const sans = "'Outfit','Inter',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

export default function BoldTemplate({
  profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
  experiences = [], educations = [], certifications = [], services = [], testimonials = [],
  books = [], publications = [], quotes = [], customSections = [],
  sectionSettings = {},
}) {
  const visible = (sectionOrder.length ? sectionOrder : ['hero', 'about', 'skills', 'projects', 'contact']).filter(s => !hiddenSections.includes(s))
  const socials = {}
  socialLinks.forEach(l => { socials[l.platform] = l.url })
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Developer · Creator'
  const sStyle = (key) => { const s = sectionSettings[key] || {}; return s.bg_color ? { background: s.bg_color } : {} }
  const SLabel = ({ children }) => <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 24 }}>{children}</div>

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: sans, minHeight: '100vh', fontSize: 14 }}>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.border}`, padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '.08em' }}>{(name.split(' ')[0] || 'Portfolio').toLowerCase()}.dev</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', overflowX: 'auto' }}>
          {visible.filter(s => s !== 'hero').slice(0, 6).map(s => (
            <a key={s} href={`#${s}`} style={{ fontFamily: mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '.12em', textDecoration: 'none', transition: 'color .15s', flexShrink: 0 }}
              onMouseEnter={e => e.target.style.color = C.head}
              onMouseLeave={e => e.target.style.color = C.mute}
            >{s}</a>
          ))}
        </div>
      </nav>

      {visible.includes('hero') && (
        <section style={{ padding: '100px 52px 80px', position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${C.border}`, ...sStyle('hero') }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 32 }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.accent}`, flexShrink: 0 }} />
              : <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}, #c084fc)`, flexShrink: 0 }} />}
            <div style={{ fontFamily: mono, fontSize: 11, color: C.accent, letterSpacing: '.15em', textTransform: 'uppercase' }}>{tagline}</div>
          </div>
          <h1 style={{ fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 900, color: C.head, lineHeight: 0.95, letterSpacing: -3, marginBottom: 24, textTransform: 'uppercase' }}>
            {name.split(' ').map((word, i) => <span key={i} style={{ display: 'block' }}>{word}</span>)}
          </h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
            {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" style={{ background: C.accent, color: '#fff', fontFamily: mono, fontSize: 11, padding: '10px 22px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.08em', fontWeight: 700 }}>GitHub ↗</a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: mono, fontSize: 11, padding: '10px 22px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.08em' }}>LinkedIn ↗</a>}
          </div>
        </section>
      )}

      {visible.includes('about') && profile?.bio && (
        <section id="about" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('about') }}>
          <SLabel>About</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 40 }}>
            <p style={{ fontSize: 16, color: C.text, lineHeight: 1.85 }}>{profile.bio}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ fontFamily: mono, fontSize: 9, color: C.mute, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,.2)' }} />
                  <span style={{ fontSize: 12, color: C.head, fontWeight: 600 }}>{(profile?.available_for || [])[0] || 'Open to work'}</span>
                </div>
              </div>
              {profile?.location && (
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
                  <div style={{ fontFamily: mono, fontSize: 9, color: C.mute, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Location</div>
                  <div style={{ fontSize: 12, color: C.head, fontWeight: 600 }}>{profile.location}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {visible.includes('skills') && skills.length > 0 && (
        <section id="skills" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, background: C.bgCard, ...sStyle('skills') }}>
          <SLabel>Stack</SLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {skills.map(s => (
              <span key={s.id || s.name} style={{ fontFamily: mono, fontSize: 11, padding: '6px 16px', background: `rgba(124,92,252,0.1)`, color: C.accent, border: `1px solid rgba(124,92,252,0.25)`, borderRadius: 100 }}>{s.name}</span>
            ))}
          </div>
        </section>
      )}

      {visible.includes('experience') && experiences.length > 0 && (
        <section id="experience" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('experience') }}>
          <SLabel>Experience</SLabel>
          {experiences.map((exp, i) => (
            <div key={exp.id || i} style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 24, paddingBottom: 28, marginBottom: 28, borderBottom: i < experiences.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 4 }}>{exp.role}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: C.accent, marginBottom: 10 }}>{exp.company}</div>
                {exp.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{exp.description}</p>}
              </div>
              {exp.period && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, textAlign: 'right' }}>{exp.period}</div>}
            </div>
          ))}
        </section>
      )}

      {visible.includes('education') && educations.length > 0 && (
        <section id="education" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, background: C.bgCard, ...sStyle('education') }}>
          <SLabel>Education</SLabel>
          {educations.map((edu, i) => (
            <div key={edu.id || i} style={{ paddingBottom: 22, marginBottom: 22, borderBottom: i < educations.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.head, marginBottom: 4 }}>{edu.degree}</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: C.accent }}>{edu.institution}{edu.period && ` · ${edu.period}`}</div>
              {edu.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, marginTop: 8 }}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {visible.includes('certifications') && certifications.length > 0 && (
        <section id="certifications" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('certifications') }}>
          <SLabel>Certifications</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {certifications.map((cert, i) => (
              <div key={cert.id || i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.head, marginBottom: 4 }}>{cert.name}</div>
                {cert.issuer && <div style={{ fontFamily: mono, fontSize: 10, color: C.accent }}>{cert.issuer}</div>}
                {cert.year && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginTop: 2 }}>{cert.year}</div>}
                {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none', display: 'block', marginTop: 8 }}>Verify ↗</a>}
              </div>
            ))}
          </div>
        </section>
      )}

      {visible.includes('services') && services.length > 0 && (
        <section id="services" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, background: C.bgCard, ...sStyle('services') }}>
          <SLabel>Services</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {services.map((svc, i) => (
              <div key={svc.id || i} style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px', transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{svc.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.head, marginBottom: 8 }}>{svc.title}</div>
                {svc.description && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{svc.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {visible.includes('testimonials') && testimonials.length > 0 && (
        <section id="testimonials" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('testimonials') }}>
          <SLabel>Testimonials</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={t.id || i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px' }}>
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: `rgba(124,92,252,.2)`, border: `1px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent, fontSize: 13 }}>{t.name[0]}</div>}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.head }}>{t.name}</div>
                    {t.role && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>{t.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {visible.includes('projects') && projects.length > 0 && (
        <section id="projects" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('projects') }}>
          <SLabel>Work</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {projects.map((p, i) => (
              <div key={p.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s, transform .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none' }}
              >
                {p.image_url ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} /> : <div style={{ height: 100, background: C.bgElev, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 40, fontWeight: 900, color: C.border, fontFamily: mono }}>0{i + 1}</span></div>}
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.head, marginBottom: 6 }}>{p.title}</div>
                  {p.description && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.65, marginBottom: 10 }}>{p.description}</p>}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, letterSpacing: '.06em', textDecoration: 'none' }}>View project ↗</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {visible.includes('contact') && (
        <section id="contact" style={{ padding: '64px 52px 80px', textAlign: 'center', ...sStyle('contact') }}>
          <SLabel>Contact</SLabel>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: C.head, marginBottom: 12, letterSpacing: -1 }}>Let's work together.</h2>
          <p style={{ color: C.text, marginBottom: 32, fontSize: 15 }}>Open for freelance, full-time, and collaborations.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.entries(socials).filter(([, v]) => v).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, padding: '10px 22px', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, textDecoration: 'none', letterSpacing: '.06em', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text }}
              >{platform.charAt(0).toUpperCase() + platform.slice(1)}</a>
            ))}
          </div>
        </section>
      )}

      {visible.includes('books') && books.length > 0 && (
        <section id="books" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('books') }}>
          <SLabel>Books</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {books.map((b, i) => (
              <div key={b.id||i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.head, marginBottom: 4 }}>{b.title}</div>
                {b.author && <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, marginBottom: 6 }}>{b.author}{b.year ? ` · ${b.year}` : ''}</div>}
                {b.notes && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{b.notes}</p>}
                {b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none', marginTop: 8, display: 'block' }}>View ↗</a>}
              </div>
            ))}
          </div>
        </section>
      )}
      {visible.includes('publications') && publications.length > 0 && (
        <section id="publications" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('publications') }}>
          <SLabel>Publications</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {publications.map((p, i) => (
              <div key={p.id||i} style={{ borderBottom: i < publications.length-1 ? `1px solid ${C.border}` : 'none', paddingBottom: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.head, marginBottom: 4 }}>{p.title}</div>
                {(p.publisher||p.year) && <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, marginBottom: 6 }}>{[p.publisher,p.year].filter(Boolean).join(' · ')}</div>}
                {p.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{p.description}</p>}
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none' }}>Read ↗</a>}
              </div>
            ))}
          </div>
        </section>
      )}
      {visible.includes('quotes') && quotes.length > 0 && (
        <section id="quotes" style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('quotes') }}>
          <SLabel>Quotes</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {quotes.map((q, i) => (
              <blockquote key={q.id||i} style={{ margin: 0, borderLeft: `3px solid ${C.accent}`, paddingLeft: 20 }}>
                <p style={{ fontSize: 20, color: C.head, lineHeight: 1.5, fontStyle: 'italic', marginBottom: 6 }}>"{q.text}"</p>
                {q.author && <cite style={{ fontFamily: mono, fontSize: 10, color: C.mute, fontStyle: 'normal' }}>— {q.author}</cite>}
              </blockquote>
            ))}
          </div>
        </section>
      )}
      {visible.includes('custom') && customSections.map(cs => (
        <section key={cs.id} id={cs.section_key} style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle(cs.section_key) }}>
          <SLabel>{cs.section_label}</SLabel>
          {cs.content && <p style={{ fontSize: 15, color: C.text, lineHeight: 1.8, maxWidth: 700 }}>{cs.content}</p>}
          {Array.isArray(cs.items) && cs.items.map((item, i) => (
            <div key={i} style={{ fontSize: 13, color: C.text, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>{typeof item==='string' ? item : JSON.stringify(item)}</div>
          ))}
        </section>
      ))}
    </div>
  )
}
