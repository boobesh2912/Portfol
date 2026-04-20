/* Minimal — vCard-style: fixed left sidebar + scrollable right content.
   Clean white, Inter sans-serif, numbered project list. */

const C = {
  bg: '#fff', bgSide: '#fafafa', bgTag: '#f4f4f4',
  border: '#e8e8e8', text: '#555', head: '#111', mute: '#aaa',
}
const sans = "'Outfit','Inter',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

function SideLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 12, color: C.mute, textDecoration: 'none', padding: '5px 0',
      fontFamily: mono, letterSpacing: '.06em', transition: 'color .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.color = C.head}
      onMouseLeave={e => e.currentTarget.style.color = C.mute}
    >
      <span style={{ width: 18, height: 1, background: C.border, display: 'inline-block', flexShrink: 0 }} />
      {children}
    </a>
  )
}

export default function MinimalTemplate({
  profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
  experiences = [], educations = [], certifications = [], services = [], testimonials = [],
  books = [], publications = [], quotes = [], customSections = [],
  sectionSettings = {},
}) {
  const visible = (sectionOrder.length ? sectionOrder : ['hero', 'about', 'skills', 'projects', 'contact']).filter(s => !hiddenSections.includes(s))
  const socials = {}
  socialLinks.forEach(l => { socials[l.platform] = l.url })
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Developer · Designer · Creator'
  const sStyle = (key) => { const s = sectionSettings[key] || {}; return s.bg_color ? { background: s.bg_color } : {} }
  const SLabel = ({ children }) => <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 22 }}>{children}</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: sans, background: C.bg, color: C.text, fontSize: 14 }}>

      <aside style={{ width: 220, flexShrink: 0, background: C.bgSide, borderRight: `1px solid ${C.border}`, padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt={name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.border}` }} />
            : <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: C.mute }}>👤</div>}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.head }}>{name}</div>
            <div style={{ fontFamily: mono, fontSize: 9, color: C.mute, marginTop: 3, letterSpacing: '.1em', textTransform: 'uppercase' }}>{tagline.split('·')[0].trim()}</div>
          </div>
          {(profile?.available_for || []).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100, padding: '3px 10px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontFamily: mono, fontSize: 9, color: '#16a34a', letterSpacing: '.06em' }}>{profile.available_for[0]}</span>
            </div>
          )}
        </div>
        <nav style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visible.filter(s => s !== 'hero').map(s => (
            <a key={s} href={`#${s}`} style={{ fontFamily: mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '.12em', textDecoration: 'none', padding: '6px 8px', borderRadius: 4, transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.bgTag; e.currentTarget.style.color = C.head }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.mute }}
            >{s.charAt(0).toUpperCase() + s.slice(1)}</a>
          ))}
        </nav>
        {Object.keys(socials).length > 0 && (
          <div style={{ marginTop: 'auto', borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            {Object.entries(socials).filter(([, v]) => v).map(([p, url]) => (
              <SideLink key={p} href={url}>{p.charAt(0).toUpperCase() + p.slice(1)}</SideLink>
            ))}
          </div>
        )}
      </aside>

      <main style={{ flex: 1 }}>
        {visible.includes('hero') && (
          <section style={{ padding: '64px 52px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('hero') }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 18 }}>Portfolio</div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: C.head, lineHeight: 1.06, letterSpacing: -1, marginBottom: 16 }}>Hi, I'm<br />{name}.</h1>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.8, maxWidth: 460, marginBottom: 28 }}>{tagline}</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, background: C.head, color: '#fff', padding: '9px 20px', borderRadius: 5, textDecoration: 'none', letterSpacing: '.06em' }}>GitHub ↗</a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, border: `1px solid ${C.border}`, color: C.head, padding: '9px 20px', borderRadius: 5, textDecoration: 'none', letterSpacing: '.06em' }}>LinkedIn ↗</a>}
            </div>
          </section>
        )}

        {visible.includes('about') && profile?.bio && (
          <section id="about" style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('about') }}>
            <SLabel>About me</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px', gap: 32, alignItems: 'start' }}>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.85 }}>{profile.bio}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {profile?.location && (
                  <div style={{ background: C.bgSide, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontFamily: mono, fontSize: 9, color: C.mute, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.08em' }}>Location</div>
                    <div style={{ fontWeight: 600, color: C.head, fontSize: 12 }}>{profile.location}</div>
                  </div>
                )}
                {(profile?.available_for || []).length > 0 && (
                  <div style={{ background: C.bgSide, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontFamily: mono, fontSize: 9, color: C.mute, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>Available for</div>
                    {profile.available_for.map(a => <div key={a} style={{ fontSize: 11, color: C.head, fontWeight: 500, marginBottom: 2 }}>{a}</div>)}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {visible.includes('skills') && skills.length > 0 && (
          <section id="skills" style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('skills') }}>
            <SLabel>Skills & Technologies</SLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map(s => <span key={s.id || s.name} style={{ fontFamily: mono, fontSize: 11, padding: '5px 14px', background: C.bgTag, color: C.text, borderRadius: 4, border: `1px solid ${C.border}` }}>{s.name}</span>)}
            </div>
          </section>
        )}

        {visible.includes('experience') && experiences.length > 0 && (
          <section id="experience" style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('experience') }}>
            <SLabel>Experience</SLabel>
            {experiences.map((exp, i) => (
              <div key={exp.id || i} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: i < experiences.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.head }}>{exp.role}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: C.mute, marginTop: 3 }}>{exp.company}{exp.period && ` · ${exp.period}`}</div>
                {exp.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, marginTop: 8 }}>{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {visible.includes('education') && educations.length > 0 && (
          <section id="education" style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('education') }}>
            <SLabel>Education</SLabel>
            {educations.map((edu, i) => (
              <div key={edu.id || i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < educations.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.head }}>{edu.degree}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: C.mute, marginTop: 3 }}>{edu.institution}{edu.period && ` · ${edu.period}`}</div>
                {edu.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, marginTop: 6 }}>{edu.description}</p>}
              </div>
            ))}
          </section>
        )}

        {visible.includes('certifications') && certifications.length > 0 && (
          <section id="certifications" style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('certifications') }}>
            <SLabel>Certifications</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {certifications.map((cert, i) => (
                <div key={cert.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: `1px solid ${C.border}`, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.head }}>{cert.name}</div>
                    {cert.issuer && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginTop: 2 }}>{cert.issuer}{cert.year && ` · ${cert.year}`}</div>}
                  </div>
                  {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.head, textDecoration: 'none' }}>Verify ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('services') && services.length > 0 && (
          <section id="services" style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('services') }}>
            <SLabel>Services</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {services.map((svc, i) => (
                <div key={svc.id || i} style={{ border: `1px solid ${C.border}`, borderRadius: 9, padding: '18px 16px' }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{svc.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.head, marginBottom: 6 }}>{svc.title}</div>
                  {svc.description && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{svc.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('testimonials') && testimonials.length > 0 && (
          <section id="testimonials" style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('testimonials') }}>
            <SLabel>Testimonials</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {testimonials.map((t, i) => (
                <div key={t.id || i} style={{ border: `1px solid ${C.border}`, borderRadius: 9, padding: '18px 16px' }}>
                  <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 12 }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {t.avatar_url ? <img src={t.avatar_url} alt={t.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.bgTag, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{t.name[0]}</div>}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12, color: C.head }}>{t.name}</div>
                      {t.role && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute }}>{t.role}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('projects') && projects.length > 0 && (
          <section id="projects" style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle('projects') }}>
            <SLabel>Selected Work</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {projects.map((p, i) => (
                <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: C.bg, transition: 'box-shadow .2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  {p.image_url ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: 130, objectFit: 'cover' }} /> : <div style={{ height: 100, background: C.bgSide, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: mono, fontSize: 28, color: C.border }}>0{i + 1}</span></div>}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.head, marginBottom: 5 }}>{p.title}</div>
                    {p.description && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.65, marginBottom: 10 }}>{p.description}</p>}
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.head, letterSpacing: '.06em', textDecoration: 'none' }}>View ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {visible.includes('contact') && (
          <section id="contact" style={{ padding: '48px 52px 72px', ...sStyle('contact') }}>
            <SLabel>Get in touch</SLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {Object.entries(socials).filter(([, v]) => v).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.head, textDecoration: 'none', fontWeight: 500, transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.head; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.head }}
                >{platform.charAt(0).toUpperCase() + platform.slice(1)} ↗</a>
              ))}
            </div>
          </section>
        )}
        {visible.includes('books') && books.length > 0 && (
          <section id="books" style={{ padding: '44px 48px', borderBottom: `1px solid ${C.border}` }}>
            <SLabel>Books</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
              {books.map((b, i) => (
                <div key={b.id||i} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.head, marginBottom: 3 }}>{b.title}</div>
                  {b.author && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginBottom: 4 }}>{b.author}{b.year ? ` · ${b.year}` : ''}</div>}
                  {b.notes && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{b.notes}</p>}
                  {b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.head, textDecoration: 'none' }}>View ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}
        {visible.includes('publications') && publications.length > 0 && (
          <section id="publications" style={{ padding: '44px 48px', borderBottom: `1px solid ${C.border}` }}>
            <SLabel>Publications</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {publications.map((p, i) => (
                <div key={p.id||i} style={{ borderBottom: i < publications.length-1 ? `1px solid ${C.border}` : 'none', paddingBottom: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.head, marginBottom: 3 }}>{p.title}</div>
                  {(p.publisher||p.year) && <div style={{ fontFamily: mono, fontSize: 10, color: C.mute, marginBottom: 4 }}>{[p.publisher,p.year].filter(Boolean).join(' · ')}</div>}
                  {p.description && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{p.description}</p>}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 10, color: C.head, textDecoration: 'none' }}>Read ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}
        {visible.includes('quotes') && quotes.length > 0 && (
          <section id="quotes" style={{ padding: '44px 48px', borderBottom: `1px solid ${C.border}` }}>
            <SLabel>Quotes</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {quotes.map((q, i) => (
                <blockquote key={q.id||i} style={{ margin: 0, borderLeft: `2px solid ${C.border}`, paddingLeft: 18 }}>
                  <p style={{ fontSize: 16, color: C.head, lineHeight: 1.55, fontStyle: 'italic', marginBottom: 4 }}>"{q.text}"</p>
                  {q.author && <cite style={{ fontFamily: mono, fontSize: 10, color: C.mute, fontStyle: 'normal' }}>— {q.author}</cite>}
                </blockquote>
              ))}
            </div>
          </section>
        )}
        {visible.includes('custom') && customSections.map(cs => (
          <section key={cs.id} id={cs.section_key} style={{ padding: '44px 48px', borderBottom: `1px solid ${C.border}` }}>
            <SLabel>{cs.section_label}</SLabel>
            {cs.content && <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, maxWidth: 680 }}>{cs.content}</p>}
            {Array.isArray(cs.items) && cs.items.map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: C.text, padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>{typeof item==='string' ? item : JSON.stringify(item)}</div>
            ))}
          </section>
        ))}
      </main>
    </div>
  )
}
