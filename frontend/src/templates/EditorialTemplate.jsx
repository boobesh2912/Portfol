/* Editorial — Fixed sidebar + scrollable main. Warm amber, Cormorant serif, Outfit body. */

const C = {
  bg: '#fafaf8', bgWarm: '#f4f3f0', bgCard: '#ffffff',
  border: '#e5e3de', border2: '#d0cec8',
  text: '#5a5950', textMid: '#7a7972', mute: '#9a9890', head: '#1a1a18',
  accent: '#e09a58', accentDim: 'rgba(224,154,88,.1)', accentBdr: 'rgba(224,154,88,.3)',
  tag: '#f4f3f0',
}
const serif = "'Cormorant Garamond','Georgia',serif"
const sans = "'Outfit','Inter',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

function Tag({ children }) {
  return <span style={{ fontFamily: mono, fontSize: 10.5, color: C.textMid, background: C.tag, border: `1px solid ${C.border}`, padding: '4px 12px', borderRadius: 6, display: 'inline-block' }}>{children}</span>
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 22 }}>{children}</div>
}

export default function EditorialTemplate({
  profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
  experiences = [], educations = [], certifications = [], services = [], testimonials = [],
  sectionSettings = {},
}) {
  const visible = (sectionOrder.length ? sectionOrder : ['hero', 'about', 'skills', 'projects', 'contact']).filter(s => !hiddenSections.includes(s))
  const socials = {}
  socialLinks.forEach(l => { socials[l.platform] = l.url })
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Developer · Creator'

  const sStyle = (key) => {
    const s = sectionSettings[key] || {}
    return s.bg_color ? { background: s.bg_color } : {}
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: sans, color: C.text, fontSize: 14 }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, background: C.bgCard,
        borderRight: `1px solid ${C.border}`, padding: '36px 22px',
        display: 'flex', flexDirection: 'column', gap: 24,
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        <div style={{ fontFamily: serif, fontSize: 20, fontStyle: 'italic', fontWeight: 600, color: C.head }}>
          {name.split(' ')[0]}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: '16px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt={name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.border}` }} />
            : <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}, #c8884a)` }} />}
          <div>
            <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.head }}>{name}</div>
            <div style={{ fontFamily: mono, fontSize: 9.5, color: C.accent, marginTop: 4, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {tagline.split('·')[0].trim()}
            </div>
          </div>
          {(profile?.available_for || []).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100, padding: '3px 10px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontFamily: mono, fontSize: 9, color: '#16a34a', letterSpacing: '.06em' }}>{(profile.available_for[0] || 'Open to work')}</span>
            </div>
          )}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visible.filter(s => s !== 'hero').map(s => {
            const label = s.charAt(0).toUpperCase() + s.slice(1)
            return (
              <a key={s} href={`#${s}`} style={{ fontFamily: mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '.12em', textDecoration: 'none', padding: '6px 8px', borderRadius: 5, transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.tag; e.currentTarget.style.color = C.head }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.mute }}
              >{label}</a>
            )
          })}
        </nav>
        <div style={{ marginTop: 'auto', borderTop: `1px solid ${C.border}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(socials).filter(([, v]) => v).map(([p, url]) => (
            <a key={p} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 10, color: C.mute, textDecoration: 'none', textTransform: 'capitalize', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.accent}
              onMouseLeave={e => e.currentTarget.style.color = C.mute}
            >
              <span style={{ width: 16, height: 1, background: C.accentBdr, display: 'inline-block', flexShrink: 0 }} />
              {p}
            </a>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1 }}>

        {visible.includes('hero') && (
          <section style={{ padding: '72px 52px 56px', borderBottom: `1px solid ${C.border}`, background: C.bgCard, ...sStyle('hero') }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 24, height: 1, background: C.accent, display: 'inline-block' }} />
              Portfolio
            </div>
            <h1 style={{ fontFamily: serif, fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 600, color: C.head, lineHeight: 1.04, letterSpacing: -.02, marginBottom: 16 }}>{name}</h1>
            <p style={{ fontFamily: sans, fontSize: 15, color: C.textMid, lineHeight: 1.8, maxWidth: 480, marginBottom: 28, fontWeight: 300 }}>{tagline}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" style={{ background: C.head, color: '#fff', fontFamily: mono, fontSize: 11, padding: '9px 20px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.06em' }}>GitHub ↗</a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ border: `1px solid ${C.accentBdr}`, color: C.accent, fontFamily: mono, fontSize: 11, padding: '9px 20px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.06em' }}>LinkedIn ↗</a>}
              <a href="#contact" style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: mono, fontSize: 11, padding: '9px 20px', borderRadius: 6, textDecoration: 'none', letterSpacing: '.06em' }}>Contact</a>
            </div>
          </section>
        )}

        {visible.includes('about') && profile?.bio && (
          <section id="about" style={{ padding: '52px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('about') }}>
            <SectionLabel>About me</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 36, alignItems: 'start' }}>
              <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.85, fontWeight: 300 }}>{profile.bio}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {profile?.location && (
                  <div style={{ background: C.bgWarm, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontFamily: mono, fontSize: 9, color: C.mute, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5 }}>Location</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{profile.location}</div>
                  </div>
                )}
                {(profile?.available_for || []).length > 0 && (
                  <div style={{ background: C.bgWarm, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontFamily: mono, fontSize: 9, color: C.mute, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Available for</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {profile.available_for.map(a => <span key={a} style={{ fontFamily: mono, fontSize: 9, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 100, padding: '2px 8px' }}>{a}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {visible.includes('skills') && skills.length > 0 && (
          <section id="skills" style={{ padding: '52px 52px', borderBottom: `1px solid ${C.border}`, background: C.bgWarm, ...sStyle('skills') }}>
            <SectionLabel>Skills & Technologies</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map(s => <Tag key={s.id || s.name}>{s.name}</Tag>)}
            </div>
          </section>
        )}

        {visible.includes('experience') && experiences.length > 0 && (
          <section id="experience" style={{ padding: '52px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('experience') }}>
            <SectionLabel>Experience</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {experiences.map((exp, i) => (
                <div key={exp.id || i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, paddingBottom: 28, marginBottom: 28, borderBottom: i < experiences.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, letterSpacing: '.06em' }}>{exp.period}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, color: C.head, marginBottom: 2 }}>{exp.role}</div>
                    <div style={{ fontFamily: mono, fontSize: 11, color: C.accent, marginBottom: 8 }}>{exp.company}</div>
                    {exp.description && <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, fontWeight: 300 }}>{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('education') && educations.length > 0 && (
          <section id="education" style={{ padding: '52px 52px', borderBottom: `1px solid ${C.border}`, background: C.bgWarm, ...sStyle('education') }}>
            <SectionLabel>Education</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {educations.map((edu, i) => (
                <div key={edu.id || i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24 }}>
                  <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, letterSpacing: '.06em' }}>{edu.period}</div>
                  <div>
                    <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 600, color: C.head, marginBottom: 2 }}>{edu.degree}</div>
                    <div style={{ fontFamily: mono, fontSize: 11, color: C.accent }}>{edu.institution}</div>
                    {edu.description && <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, marginTop: 6, fontWeight: 300 }}>{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('certifications') && certifications.length > 0 && (
          <section id="certifications" style={{ padding: '52px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('certifications') }}>
            <SectionLabel>Certifications</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {certifications.map((cert, i) => (
                <div key={cert.id || i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 600, color: C.head, marginBottom: 4, lineHeight: 1.3 }}>{cert.name}</div>
                  {cert.issuer && <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, marginBottom: 4 }}>{cert.issuer}</div>}
                  {cert.year && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>{cert.year}</div>}
                  {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none', display: 'block', marginTop: 8 }}>View ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('services') && services.length > 0 && (
          <section id="services" style={{ padding: '52px 52px', borderBottom: `1px solid ${C.border}`, background: C.bgWarm, ...sStyle('services') }}>
            <SectionLabel>Services</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {services.map((svc, i) => (
                <div key={svc.id || i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{svc.icon}</div>
                  <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.head, marginBottom: 6 }}>{svc.title}</div>
                  {svc.description && <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, fontWeight: 300 }}>{svc.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('testimonials') && testimonials.length > 0 && (
          <section id="testimonials" style={{ padding: '52px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('testimonials') }}>
            <SectionLabel>Testimonials</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {testimonials.map((t, i) => (
                <div key={t.id || i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 20px' }}>
                  <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16, fontFamily: serif, fontWeight: 400 }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {t.avatar_url
                      ? <img src={t.avatar_url} alt={t.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.accentDim, border: `1px solid ${C.accentBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 14, color: C.accent }}>{t.name[0]}</div>}
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
          <section id="projects" style={{ padding: '52px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('projects') }}>
            <SectionLabel>Selected Projects</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {projects.map(p => (
                <div key={p.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBdr; e.currentTarget.style.boxShadow = '0 4px 20px rgba(224,154,88,.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    : <div style={{ height: 100, background: C.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: serif, fontSize: 32, color: C.accentBdr }}>✦</span>
                      </div>}
                  <div style={{ padding: '16px 18px' }}>
                    <h3 style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, color: C.head, marginBottom: 6, lineHeight: 1.2 }}>{p.title}</h3>
                    {p.description && <p style={{ fontSize: 12, color: C.textMid, lineHeight: 1.65, marginBottom: 10, fontWeight: 300 }}>{p.description}</p>}
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none' }}>View Project ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('contact') && (
          <section id="contact" style={{ padding: '52px 52px 80px', background: C.bgCard, ...sStyle('contact') }}>
            <SectionLabel>Get in touch</SectionLabel>
            <h2 style={{ fontFamily: serif, fontSize: 34, fontWeight: 600, color: C.head, marginBottom: 8 }}>
              Let's work<br /><em style={{ color: C.accent }}>together.</em>
            </h2>
            <p style={{ color: C.textMid, marginBottom: 28, fontSize: 14, fontWeight: 300 }}>Open to freelance, full-time opportunities, and collaborations.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380 }}>
              {Object.entries(socials).filter(([, v]) => v).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: C.bg,
                  border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.head, fontWeight: 500, textDecoration: 'none', transition: 'all .15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBdr; e.currentTarget.style.background = C.accentDim }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: C.tag, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: mono, fontSize: 9, color: C.mute, textTransform: 'uppercase' }}>{platform.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginTop: 1 }}>{url.replace(/^https?:\/\//, '').split('/').slice(0, 2).join('/')}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: C.accent, fontWeight: 700 }}>→</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
