/* Magazine — Red accent, Georgia serif, split hero, numbered sections. */

const C = {
  bg: '#fafaf8', bgDark: '#1a1a18', bgCard: '#ffffff',
  border: '#e5e3de', text: '#5a5950', head: '#1a1a18', mute: '#9a9890',
  accent: '#e63946',
}
const serif = "'Cormorant Garamond','Georgia',serif"
const sans = "'Outfit','Inter',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

let _sectionNum = 0
function resetNum() { _sectionNum = 0 }
function Num() { _sectionNum++; return <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 600, color: C.border, lineHeight: 1 }}>{String(_sectionNum).padStart(2, '0')}</div> }

export default function MagazineTemplate({
  profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
  experiences = [], educations = [], certifications = [], services = [], testimonials = [],
  books = [], publications = [], quotes = [], customSections = [],
  sectionSettings = {},
}) {
  resetNum()
  const visible = (sectionOrder.length ? sectionOrder : ['hero', 'about', 'skills', 'projects', 'contact']).filter(s => !hiddenSections.includes(s))
  const socials = {}
  socialLinks.forEach(l => { socials[l.platform] = l.url })
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Developer · Designer'

  const sStyle = (key) => {
    const s = sectionSettings[key] || {}
    return s.bg_color ? { background: s.bg_color } : {}
  }

  const Section = ({ id, label, children, bg }) => (
    <section id={id} style={{ padding: '64px 52px', borderBottom: `1px solid ${C.border}`, background: bg || C.bg, ...sStyle(id) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6 }}>{label}</div>
          <Num />
        </div>
        <div>{children}</div>
      </div>
    </section>
  )

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: sans, minHeight: '100vh', fontSize: 14 }}>

      <header style={{ borderBottom: `1px solid ${C.border}`, padding: '0 52px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(250,250,248,.95)', backdropFilter: 'blur(10px)', zIndex: 50 }}>
        <span style={{ fontFamily: serif, fontSize: 24, fontWeight: 600, fontStyle: 'italic', color: C.head }}>{name.split(' ')[0]}</span>
        <nav style={{ display: 'flex', gap: 28 }}>
          {visible.filter(s => s !== 'hero').slice(0, 5).map(s => (
            <a key={s} href={`#${s}`} style={{ fontFamily: mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '.12em', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => e.target.style.color = C.head}
              onMouseLeave={e => e.target.style.color = C.mute}
            >{s}</a>
          ))}
        </nav>
      </header>

      {visible.includes('hero') && (
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 440, borderBottom: `1px solid ${C.border}`, ...sStyle('hero') }}>
          <div style={{ background: C.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 100, height: 100, borderRadius: '50%', background: `rgba(230,57,70,.2)`, border: `2px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👤</div>
                  <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em' }}>YOUR PHOTO</span>
                </div>}
          </div>
          <div style={{ padding: '52px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, letterSpacing: '.2em', textTransform: 'uppercase' }}>Portfolio</div>
            <h1 style={{ fontFamily: serif, fontSize: 'clamp(38px, 5vw, 58px)', fontWeight: 600, color: C.head, lineHeight: 1.06, letterSpacing: -.5 }}>{name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 3, background: C.accent, borderRadius: 2 }} />
              <span style={{ fontFamily: mono, fontSize: 11, color: C.mute, letterSpacing: '.1em', textTransform: 'uppercase' }}>{tagline}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" style={{ background: C.head, color: '#fff', fontFamily: mono, fontSize: 11, padding: '9px 20px', borderRadius: 5, textDecoration: 'none', letterSpacing: '.06em' }}>GitHub ↗</a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ border: `1px solid ${C.border}`, color: C.head, fontFamily: mono, fontSize: 11, padding: '9px 20px', borderRadius: 5, textDecoration: 'none', letterSpacing: '.06em' }}>LinkedIn ↗</a>}
            </div>
          </div>
        </section>
      )}

      {visible.includes('about') && profile?.bio && (
        <Section id="about" label="About">
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 16, lineHeight: 1.15 }}>About me</h2>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.85, maxWidth: 520 }}>{profile.bio}</p>
          {profile?.location && <div style={{ fontFamily: mono, fontSize: 11, color: C.mute, marginTop: 14 }}>📍 {profile.location}</div>}
          {(profile?.available_for || []).length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {profile.available_for.map(a => <span key={a} style={{ fontFamily: mono, fontSize: 10, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 100, padding: '3px 10px' }}>{a}</span>)}
            </div>
          )}
        </Section>
      )}

      {visible.includes('skills') && skills.length > 0 && (
        <Section id="skills" label="Skills" bg={C.bgCard}>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 20, lineHeight: 1.15 }}>What I work with</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skills.map(s => (
              <span key={s.id || s.name} style={{ fontFamily: mono, fontSize: 11, padding: '5px 14px', background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4 }}>{s.name}</span>
            ))}
          </div>
        </Section>
      )}

      {visible.includes('experience') && experiences.length > 0 && (
        <Section id="experience" label="Experience">
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 24 }}>Work Experience</h2>
          {experiences.map((exp, i) => (
            <div key={exp.id || i} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: i < experiences.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, color: C.head }}>{exp.role}</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '4px 0 8px' }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: C.accent }}>{exp.company}</span>
                {exp.period && <span style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>· {exp.period}</span>}
              </div>
              {exp.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{exp.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {visible.includes('education') && educations.length > 0 && (
        <Section id="education" label="Education" bg={C.bgCard}>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 24 }}>Education</h2>
          {educations.map((edu, i) => (
            <div key={edu.id || i} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: i < educations.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, color: C.head }}>{edu.degree}</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '4px 0 8px' }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: C.accent }}>{edu.institution}</span>
                {edu.period && <span style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>· {edu.period}</span>}
              </div>
              {edu.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{edu.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {visible.includes('certifications') && certifications.length > 0 && (
        <Section id="certifications" label="Certifications">
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 24 }}>Certifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {certifications.map((cert, i) => (
              <div key={cert.id || i} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 18px' }}>
                <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.head, marginBottom: 4 }}>{cert.name}</div>
                {cert.issuer && <div style={{ fontFamily: mono, fontSize: 10, color: C.accent }}>{cert.issuer}</div>}
                {cert.year && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginTop: 2 }}>{cert.year}</div>}
                {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none', display: 'block', marginTop: 8 }}>Verify ↗</a>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible.includes('services') && services.length > 0 && (
        <Section id="services" label="Services" bg={C.bgCard}>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 24 }}>What I offer</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {services.map((svc, i) => (
              <div key={svc.id || i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px 18px' }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{svc.icon}</div>
                <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.head, marginBottom: 6 }}>{svc.title}</div>
                {svc.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{svc.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible.includes('testimonials') && testimonials.length > 0 && (
        <Section id="testimonials" label="Testimonials">
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 24 }}>What people say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={t.id || i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px 18px' }}>
                <p style={{ fontFamily: serif, fontSize: 15, fontStyle: 'italic', color: C.text, lineHeight: 1.7, marginBottom: 14 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {t.avatar_url
                    ? <img src={t.avatar_url} alt={t.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                    : <div style={{ width: 32, height: 32, borderRadius: '50%', background: `rgba(230,57,70,.1)`, border: `1px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: C.accent }}>{t.name[0]}</div>}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.head }}>{t.name}</div>
                    {t.role && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>{t.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible.includes('projects') && projects.length > 0 && (
        <Section id="projects" label="Projects" bg={C.bgCard}>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 28 }}>Selected work</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {projects.map((p, i) => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 20, padding: '24px 0', borderBottom: `1px solid ${C.border}`, alignItems: 'start' }}>
                <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, color: C.accent, lineHeight: 1, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  {p.image_url && <img src={p.image_url} alt={p.title} style={{ width: '100%', maxWidth: 380, height: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 14, border: `1px solid ${C.border}` }} />}
                  <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, color: C.head, marginBottom: 6 }}>{p.title}</div>
                  {p.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, marginBottom: 10 }}>{p.description}</p>}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, letterSpacing: '.08em', textDecoration: 'none', textTransform: 'uppercase' }}>View project ↗</a>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible.includes('contact') && (
        <section id="contact" style={{ padding: '64px 52px 80px', background: C.bgCard, ...sStyle('contact') }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32 }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.accent, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6 }}>Contact</div>
              <Num />
            </div>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.head, marginBottom: 8 }}>Let's talk</h2>
              <p style={{ color: C.text, marginBottom: 24, fontSize: 14 }}>Always open to new projects and opportunities.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
                {Object.entries(socials).filter(([, v]) => v).map(([p, url]) => (
                  <a key={p} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.head, textDecoration: 'none', fontWeight: 500, transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = 'rgba(230,57,70,.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{p}</span>
                    <span style={{ color: C.accent, fontWeight: 700 }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {visible.includes('books') && books.length > 0 && (
        <section id="books" style={{ padding: '56px 52px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, alignItems: 'start' }}>
            <Num />
            <div>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 16 }}>Books</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>
                {books.map((b, i) => (
                  <div key={b.id||i} style={{ borderLeft: `2px solid ${C.border}`, paddingLeft: 14 }}>
                    <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 600, color: C.head, marginBottom: 2 }}>{b.title}</div>
                    {b.author && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>{b.author}{b.year ? ` · ${b.year}` : ''}</div>}
                    {b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none' }}>View ↗</a>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {visible.includes('publications') && publications.length > 0 && (
        <section id="publications" style={{ padding: '56px 52px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, alignItems: 'start' }}>
            <Num />
            <div>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 16 }}>Publications</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {publications.map((p, i) => (
                  <div key={p.id||i} style={{ borderBottom: i < publications.length-1 ? `1px solid ${C.border}` : 'none', paddingBottom: 16 }}>
                    <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, color: C.head, marginBottom: 4 }}>{p.title}</div>
                    {(p.publisher||p.year) && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginBottom: 6 }}>{[p.publisher,p.year].filter(Boolean).join(' · ')}</div>}
                    {p.description && <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>{p.description}</p>}
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.accent, textDecoration: 'none' }}>Read ↗</a>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {visible.includes('quotes') && quotes.length > 0 && (
        <section id="quotes" style={{ padding: '56px 52px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, alignItems: 'start' }}>
            <Num />
            <div>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 16 }}>Quotes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {quotes.map((q, i) => (
                  <blockquote key={q.id||i} style={{ margin: 0 }}>
                    <p style={{ fontFamily: serif, fontSize: 22, fontStyle: 'italic', color: C.head, lineHeight: 1.4, marginBottom: 6 }}>"{q.text}"</p>
                    {q.author && <cite style={{ fontFamily: mono, fontSize: 10, color: C.mute, fontStyle: 'normal' }}>— {q.author}</cite>}
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {visible.includes('custom') && customSections.map(cs => (
        <section key={cs.id} id={cs.section_key} style={{ padding: '56px 52px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, alignItems: 'start' }}>
            <Num />
            <div>
              <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 16 }}>{cs.section_label}</div>
              {cs.content && <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8 }}>{cs.content}</p>}
              {Array.isArray(cs.items) && cs.items.map((item, i) => (
                <div key={i} style={{ fontSize: 13, color: C.text, padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>{typeof item==='string' ? item : JSON.stringify(item)}</div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <footer style={{ padding: '20px 52px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: C.head }}>{name}</span>
        <span style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
