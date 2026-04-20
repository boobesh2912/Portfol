/* CardGrid — Light, full-page with blob hero + colorful skill badges + masonry grid. */

const C = {
  bg: '#f8f8f8', bgCard: '#ffffff', border: '#ebebeb',
  text: '#666', head: '#1a1a2e', mute: '#aaa',
  accent: '#4361ee', accentLight: 'rgba(67,97,238,.08)',
}
const sans = "'Poppins','Outfit',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

const SKILL_COLORS = [
  { bg: '#dbeafe', color: '#1d4ed8' }, { bg: '#fce7f3', color: '#9d174d' },
  { bg: '#dcfce7', color: '#15803d' }, { bg: '#fef3c7', color: '#b45309' },
  { bg: '#ede9fe', color: '#6d28d9' }, { bg: '#ffedd5', color: '#c2410c' },
  { bg: '#ecfdf5', color: '#065f46' }, { bg: '#f0fdf4', color: '#166534' },
]

export default function CardGridTemplate({
  profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
  experiences = [], educations = [], certifications = [], services = [], testimonials = [],
  books = [], publications = [], quotes = [], customSections = [],
  sectionSettings = {},
}) {
  const visible = (sectionOrder.length ? sectionOrder : ['hero', 'about', 'skills', 'projects', 'contact']).filter(s => !hiddenSections.includes(s))
  const socials = {}
  socialLinks.forEach(l => { socials[l.platform] = l.url })
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Web Developer & Designer'
  const sStyle = (key) => { const s = sectionSettings[key] || {}; return s.bg_color ? { background: s.bg_color } : {} }
  const SHead = ({ title, sub }) => (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: C.head, marginBottom: 6 }}>{title}</h2>
      {sub && <p style={{ color: C.text, fontSize: 14 }}>{sub}</p>}
    </div>
  )

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: sans, minHeight: '100vh', fontSize: 14 }}>

      <header style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, padding: '0 48px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: C.head }}>{name.split(' ')[0] || 'Portfolio'}</span>
        <nav style={{ display: 'flex', gap: 24 }}>
          {visible.filter(s => s !== 'hero').slice(0, 5).map(s => (
            <a key={s} href={`#${s}`} style={{ fontSize: 13, fontWeight: 600, color: C.text, textDecoration: 'none', transition: 'color .15s', textTransform: 'capitalize' }}
              onMouseEnter={e => e.target.style.color = C.accent}
              onMouseLeave={e => e.target.style.color = C.text}
            >{s}</a>
          ))}
        </nav>
      </header>

      {visible.includes('hero') && (
        <section style={{ padding: '80px 48px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', borderBottom: `1px solid ${C.border}`, ...sStyle('hero') }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.accent, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 16 }}>Hello, I'm</div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 700, color: C.head, lineHeight: 1.12, letterSpacing: -1, marginBottom: 16 }}>
              {name}<br /><span style={{ color: C.accent }}>{tagline.split('·')[0].trim() || 'Developer'}</span>
            </h1>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, maxWidth: 380, marginBottom: 28 }}>
              {profile?.bio || 'Building beautiful things for the web.'}
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" style={{ background: C.accent, color: '#fff', fontSize: 13, fontWeight: 600, padding: '11px 24px', borderRadius: 8, textDecoration: 'none' }}>GitHub ↗</a>}
              <a href="#contact" style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.head, fontSize: 13, fontWeight: 600, padding: '11px 24px', borderRadius: 8, textDecoration: 'none' }}>Contact me</a>
            </div>
            {profile?.location && <div style={{ fontFamily: mono, fontSize: 11, color: C.mute }}>📍 {profile.location}</div>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 280, height: 320 }}>
              <svg viewBox="0 0 479 467" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <defs>
                  <clipPath id="blob-clip">
                    <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z"/>
                  </clipPath>
                </defs>
                <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z" fill={C.accent} opacity=".15"/>
                {profile?.avatar_url
                  ? <image href={profile.avatar_url} x="40" y="20" width="400" height="430" clipPath="url(#blob-clip)" preserveAspectRatio="xMidYMid slice" />
                  : <text x="240" y="260" textAnchor="middle" fontSize="80" fill={C.accent} opacity=".3" fontFamily="sans-serif">👤</text>}
              </svg>
            </div>
          </div>
        </section>
      )}

      {visible.includes('about') && profile?.bio && (
        <section id="about" style={{ padding: '64px 48px', background: '#fff', borderBottom: `1px solid ${C.border}`, ...sStyle('about') }}>
          <SHead title="About Me" sub="A little bit about who I am." />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.85 }}>{profile.bio}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {profile?.location && (
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.08em' }}>Location</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.head }}>{profile.location}</div>
                </div>
              )}
              {(profile?.available_for || []).length > 0 && (
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em' }}>Available for</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {profile.available_for.map(a => <span key={a} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: '#dcfce7', color: '#15803d', borderRadius: 100 }}>{a}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {visible.includes('skills') && skills.length > 0 && (
        <section id="skills" style={{ padding: '64px 48px', background: '#fff', borderBottom: `1px solid ${C.border}`, ...sStyle('skills') }}>
          <SHead title="My Skills" sub="Technologies & tools I work with." />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {skills.map((s, i) => {
              const clr = SKILL_COLORS[i % SKILL_COLORS.length]
              return <span key={s.id || s.name} style={{ fontSize: 12, fontWeight: 600, padding: '6px 16px', background: clr.bg, color: clr.color, borderRadius: 100 }}>{s.name}</span>
            })}
          </div>
        </section>
      )}

      {visible.includes('experience') && experiences.length > 0 && (
        <section id="experience" style={{ padding: '64px 48px', borderBottom: `1px solid ${C.border}`, ...sStyle('experience') }}>
          <SHead title="Experience" sub="My professional journey." />
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: C.border }} />
            {experiences.map((exp, i) => (
              <div key={exp.id || i} style={{ position: 'relative', paddingBottom: 28, marginBottom: 4 }}>
                <div style={{ position: 'absolute', left: -29, top: 4, width: 10, height: 10, borderRadius: '50%', background: C.accent, border: '2px solid #fff', boxShadow: `0 0 0 2px ${C.accent}` }} />
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.head }}>{exp.role}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: C.accent, margin: '4px 0 8px' }}>{exp.company}{exp.period && ` · ${exp.period}`}</div>
                  {exp.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {visible.includes('education') && educations.length > 0 && (
        <section id="education" style={{ padding: '64px 48px', background: '#fff', borderBottom: `1px solid ${C.border}`, ...sStyle('education') }}>
          <SHead title="Education" sub="Academic background." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {educations.map((edu, i) => (
              <div key={edu.id || i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: '18px 20px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.head, marginBottom: 4 }}>{edu.degree}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: C.accent }}>{edu.institution}</div>
                {edu.period && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginTop: 4 }}>{edu.period}</div>}
                {edu.description && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginTop: 8 }}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {visible.includes('certifications') && certifications.length > 0 && (
        <section id="certifications" style={{ padding: '64px 48px', borderBottom: `1px solid ${C.border}`, ...sStyle('certifications') }}>
          <SHead title="Certifications" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {certifications.map((cert, i) => (
              <div key={cert.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 18px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.head }}>{cert.name}</div>
                  {cert.issuer && <div style={{ fontFamily: mono, fontSize: 11, color: C.mute, marginTop: 2 }}>{cert.issuer}{cert.year && ` · ${cert.year}`}</div>}
                </div>
                {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, color: C.accent, textDecoration: 'none', fontWeight: 600 }}>Verify ↗</a>}
              </div>
            ))}
          </div>
        </section>
      )}

      {visible.includes('services') && services.length > 0 && (
        <section id="services" style={{ padding: '64px 48px', background: '#fff', borderBottom: `1px solid ${C.border}`, ...sStyle('services') }}>
          <SHead title="Services" sub="What I can do for you." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {services.map((svc, i) => {
              const clr = SKILL_COLORS[i % SKILL_COLORS.length]
              return (
                <div key={svc.id || i} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px', transition: 'box-shadow .2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(67,97,238,.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: clr.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{svc.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.head, marginBottom: 6 }}>{svc.title}</div>
                  {svc.description && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{svc.description}</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {visible.includes('testimonials') && testimonials.length > 0 && (
        <section id="testimonials" style={{ padding: '64px 48px', borderBottom: `1px solid ${C.border}`, ...sStyle('testimonials') }}>
          <SHead title="Testimonials" sub="What clients say about working with me." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={t.id || i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px' }}>
                <div style={{ fontSize: 28, color: C.accent, fontWeight: 900, lineHeight: 1, marginBottom: 10 }}>"</div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.accent }}>{t.name[0]}</div>}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.head }}>{t.name}</div>
                    {t.role && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>{t.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {visible.includes('projects') && projects.length > 0 && (
        <section id="projects" style={{ padding: '64px 48px', borderBottom: `1px solid ${C.border}`, ...sStyle('projects') }}>
          <SHead title="Work" sub="Some things I've built." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {projects.map(p => (
              <a key={p.id} href={p.url || '#'} target="_blank" rel="noopener noreferrer" style={{ background: C.bgCard, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, textDecoration: 'none', display: 'block', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(67,97,238,.12)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
              >
                {p.image_url ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} /> : <div style={{ height: 120, background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>💻</div>}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.head, marginBottom: 5 }}>{p.title}</div>
                  {p.description && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{p.description}</p>}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {visible.includes('contact') && (
        <section id="contact" style={{ padding: '64px 48px 80px', background: '#fff', ...sStyle('contact') }}>
          <SHead title="Contact" sub="Let's get in touch. I'm always open to new opportunities." />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(socials).filter(([, v]) => v).map(([p, url]) => (
              <a key={p} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.accent, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'opacity .15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >{p.charAt(0).toUpperCase() + p.slice(1)}</a>
            ))}
          </div>
        </section>
      )}

      {visible.includes('books') && books.length > 0 && (
        <section id="books" style={{ padding: '52px 48px', borderBottom: `1px solid ${C.border}` }}>
          <SHead title="Books" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 16 }}>
            {books.map((b, i) => (
              <div key={b.id||i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.head, marginBottom: 4 }}>{b.title}</div>
                {b.author && <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, marginBottom: 6 }}>{b.author}{b.year ? ` · ${b.year}` : ''}</div>}
                {b.notes && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{b.notes}</p>}
                {b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none' }}>View ↗</a>}
              </div>
            ))}
          </div>
        </section>
      )}
      {visible.includes('publications') && publications.length > 0 && (
        <section id="publications" style={{ padding: '52px 48px', borderBottom: `1px solid ${C.border}` }}>
          <SHead title="Publications" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {publications.map((p, i) => (
              <div key={p.id||i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.head, marginBottom: 4 }}>{p.title}</div>
                {(p.publisher||p.year) && <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, marginBottom: 6 }}>{[p.publisher,p.year].filter(Boolean).join(' · ')}</div>}
                {p.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{p.description}</p>}
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none' }}>Read ↗</a>}
              </div>
            ))}
          </div>
        </section>
      )}
      {visible.includes('quotes') && quotes.length > 0 && (
        <section id="quotes" style={{ padding: '52px 48px', borderBottom: `1px solid ${C.border}` }}>
          <SHead title="Quotes" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {quotes.map((q, i) => (
              <div key={q.id||i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px' }}>
                <p style={{ fontSize: 15, color: C.head, lineHeight: 1.55, fontStyle: 'italic', marginBottom: 10 }}>"{q.text}"</p>
                {q.author && <cite style={{ fontFamily: mono, fontSize: 10, color: C.mute, fontStyle: 'normal' }}>— {q.author}</cite>}
              </div>
            ))}
          </div>
        </section>
      )}
      {customSections.filter(cs => visible.includes(cs.section_key)).map(cs => (
        <section key={cs.id} id={cs.section_key} style={{ padding: '52px 48px', borderBottom: `1px solid ${C.border}` }}>
          <SHead title={cs.section_label} />
          {cs.content && <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, maxWidth: 700 }}>{cs.content}</p>}
          {Array.isArray(cs.items) && cs.items.map((item, i) => (
            <div key={i} style={{ fontSize: 13, color: C.text, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>{typeof item==='string' ? item : JSON.stringify(item)}</div>
          ))}
        </section>
      ))}

      <footer style={{ padding: '24px 48px', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
        <p style={{ fontFamily: mono, fontSize: 11, color: C.mute }}>© {new Date().getFullYear()} {name}</p>
      </footer>
    </div>
  )
}
