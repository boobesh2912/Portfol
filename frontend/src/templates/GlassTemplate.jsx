/* GlassTemplate — frosted glass cards on a purple→blue gradient bg. Pro template. */

const G = {
  bg1: '#0f0c29', bg2: '#302b63', bg3: '#24243e',
  glass: 'rgba(255,255,255,0.07)',
  glassBorder: 'rgba(255,255,255,0.15)',
  text: 'rgba(255,255,255,0.85)',
  mute: 'rgba(255,255,255,0.45)',
  head: '#ffffff',
  accent: '#a78bfa',
  accent2: '#60a5fa',
}
const sans = "'Outfit','Inter',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

const card = (extra = {}) => ({
  background: G.glass,
  border: `1px solid ${G.glassBorder}`,
  borderRadius: 16,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  padding: '28px 32px',
  ...extra,
})

const SLabel = ({ children }) => (
  <div style={{ fontFamily: mono, fontSize: 10, color: G.accent, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${G.accent}40,transparent)` }} />
    {children}
    <span style={{ flex: 1, height: 1, background: `linear-gradient(270deg,${G.accent}40,transparent)` }} />
  </div>
)

export default function GlassTemplate({
  profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
  experiences = [], educations = [], certifications = [], services = [], testimonials = [],
  books = [], publications = [], quotes = [], customSections = [],
  sectionSettings = {},
}) {
  const visible = (sectionOrder.length ? sectionOrder : ['hero', 'about', 'skills', 'projects', 'contact'])
    .filter(s => !hiddenSections.includes(s))
  const socials = {}
  socialLinks.forEach(l => { socials[l.platform] = l.url })
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Developer · Designer · Creator'

  return (
    <div style={{
      minHeight: '100vh', fontFamily: sans, color: G.text, fontSize: 14,
      background: `linear-gradient(135deg, ${G.bg1} 0%, ${G.bg2} 50%, ${G.bg3} 100%)`,
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.15),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.12),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* HERO */}
        {visible.includes('hero') && (
          <section id="hero" style={{ textAlign: 'center', padding: '64px 0 48px' }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${G.glassBorder}`, marginBottom: 20, boxShadow: `0 0 32px ${G.accent}40` }} />
              : <div style={{ width: 100, height: 100, borderRadius: '50%', background: G.glass, border: `2px solid ${G.glassBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>👤</div>}
            <h1 style={{ fontFamily: sans, fontSize: 48, fontWeight: 800, color: G.head, margin: '0 0 12px', lineHeight: 1.1, letterSpacing: -1 }}>{name}</h1>
            <p style={{ fontFamily: mono, fontSize: 13, color: G.accent, letterSpacing: '.12em', marginBottom: 20 }}>{tagline}</p>
            {(profile?.available_for || []).length > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontFamily: mono, fontSize: 11, color: '#4ade80' }}>{profile.available_for[0]}</span>
              </div>
            )}
            {Object.keys(socials).length > 0 && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
                {Object.entries(socials).filter(([, v]) => v).map(([p, url]) => (
                  <a key={p} href={url} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: mono, fontSize: 11, color: G.mute, padding: '5px 14px',
                    border: `1px solid ${G.glassBorder}`, borderRadius: 100, textDecoration: 'none',
                    background: G.glass, backdropFilter: 'blur(8px)', letterSpacing: '.08em',
                    transition: 'all .2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = G.head; e.currentTarget.style.borderColor = G.accent }}
                    onMouseLeave={e => { e.currentTarget.style.color = G.mute; e.currentTarget.style.borderColor = G.glassBorder }}
                  >{p}</a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ABOUT */}
        {visible.includes('about') && (
          <section id="about" style={{ marginBottom: 32 }}>
            <SLabel>About</SLabel>
            <div style={card()}>
              <p style={{ margin: 0, lineHeight: 1.8, color: G.text, fontSize: 15 }}>{profile?.bio || 'Tell your story here.'}</p>
              {profile?.location && <div style={{ marginTop: 16, fontFamily: mono, fontSize: 11, color: G.mute }}>📍 {profile.location}</div>}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {visible.includes('skills') && skills.length > 0 && (
          <section id="skills" style={{ marginBottom: 32 }}>
            <SLabel>Skills</SLabel>
            <div style={card()}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map(s => (
                  <span key={s.id} style={{
                    fontFamily: mono, fontSize: 12, padding: '5px 14px', borderRadius: 100,
                    background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)',
                    color: G.accent, letterSpacing: '.04em',
                  }}>{s.name}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {visible.includes('experience') && experiences.length > 0 && (
          <section id="experience" style={{ marginBottom: 32 }}>
            <SLabel>Experience</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {experiences.map(exp => (
                <div key={exp.id} style={card()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: G.head, fontSize: 16 }}>{exp.title}</div>
                      <div style={{ color: G.accent, fontSize: 13 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: 11, color: G.mute, textAlign: 'right' }}>{exp.start_date} — {exp.end_date || 'Present'}</div>
                  </div>
                  {exp.description && <p style={{ margin: '8px 0 0', lineHeight: 1.7, color: G.text, fontSize: 13 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {visible.includes('education') && educations.length > 0 && (
          <section id="education" style={{ marginBottom: 32 }}>
            <SLabel>Education</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {educations.map(edu => (
                <div key={edu.id} style={card()}>
                  <div style={{ fontWeight: 700, color: G.head, fontSize: 16 }}>{edu.degree}</div>
                  <div style={{ color: G.accent, fontSize: 13, marginTop: 2 }}>{edu.school}</div>
                  {edu.year && <div style={{ fontFamily: mono, fontSize: 11, color: G.mute, marginTop: 4 }}>{edu.year}</div>}
                  {edu.description && <p style={{ margin: '8px 0 0', lineHeight: 1.7, color: G.text, fontSize: 13 }}>{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {visible.includes('certifications') && certifications.length > 0 && (
          <section id="certifications" style={{ marginBottom: 32 }}>
            <SLabel>Certifications</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
              {certifications.map(c => (
                <div key={c.id} style={card({ padding: '20px 24px' })}>
                  <div style={{ fontWeight: 700, color: G.head, fontSize: 14 }}>{c.name}</div>
                  {c.issuer && <div style={{ color: G.accent, fontSize: 12, marginTop: 4 }}>{c.issuer}</div>}
                  {c.year && <div style={{ fontFamily: mono, fontSize: 11, color: G.mute, marginTop: 4 }}>{c.year}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {visible.includes('projects') && projects.length > 0 && (
          <section id="projects" style={{ marginBottom: 32 }}>
            <SLabel>Projects</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
              {projects.map(p => (
                <div key={p.id} style={{ ...card(), display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.image_url && <img src={p.image_url} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, border: `1px solid ${G.glassBorder}` }} />}
                  <div style={{ fontWeight: 700, color: G.head, fontSize: 16 }}>{p.title}</div>
                  {p.description && <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: G.text }}>{p.description}</p>}
                  {(p.tags || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {p.tags.map(tag => <span key={tag} style={{ fontFamily: mono, fontSize: 10, padding: '3px 10px', borderRadius: 100, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)', color: G.accent2 }}>{tag}</span>)}
                    </div>
                  )}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, color: G.accent, textDecoration: 'none', letterSpacing: '.06em', marginTop: 'auto' }}>View project →</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES */}
        {visible.includes('services') && services.length > 0 && (
          <section id="services" style={{ marginBottom: 32 }}>
            <SLabel>Services</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
              {services.map(s => (
                <div key={s.id} style={card({ padding: '24px' })}>
                  {s.icon && <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>}
                  <div style={{ fontWeight: 700, color: G.head, fontSize: 15, marginBottom: 8 }}>{s.title}</div>
                  {s.description && <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: G.text }}>{s.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        {visible.includes('testimonials') && testimonials.length > 0 && (
          <section id="testimonials" style={{ marginBottom: 32 }}>
            <SLabel>Testimonials</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {testimonials.map(t => (
                <div key={t.id} style={card()}>
                  <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.8, color: G.text, fontStyle: 'italic' }}>"{t.body}"</p>
                  <div style={{ fontWeight: 700, color: G.accent, fontSize: 13 }}>{t.author}</div>
                  {t.role && <div style={{ fontSize: 12, color: G.mute }}>{t.role}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BOOKS */}
        {visible.includes('books') && books.length > 0 && (
          <section id="books" style={{ marginBottom: 32 }}>
            <SLabel>Books</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {books.map(b => (
                <div key={b.id} style={card({ padding: '20px' })}>
                  <div style={{ fontWeight: 700, color: G.head, fontSize: 14, marginBottom: 4 }}>{b.title}</div>
                  {b.author && <div style={{ fontSize: 12, color: G.accent }}>{b.author}</div>}
                  {b.note && <p style={{ margin: '8px 0 0', fontSize: 12, lineHeight: 1.6, color: G.mute }}>{b.note}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PUBLICATIONS */}
        {visible.includes('publications') && publications.length > 0 && (
          <section id="publications" style={{ marginBottom: 32 }}>
            <SLabel>Publications</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {publications.map(p => (
                <div key={p.id} style={card()}>
                  <div style={{ fontWeight: 700, color: G.head, fontSize: 15 }}>{p.title}</div>
                  {p.venue && <div style={{ fontSize: 12, color: G.accent, marginTop: 3 }}>{p.venue}</div>}
                  {p.year && <div style={{ fontFamily: mono, fontSize: 11, color: G.mute, marginTop: 3 }}>{p.year}</div>}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, color: G.accent, textDecoration: 'none', marginTop: 8, display: 'block' }}>Read →</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QUOTES */}
        {visible.includes('quotes') && quotes.length > 0 && (
          <section id="quotes" style={{ marginBottom: 32 }}>
            <SLabel>Quotes</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {quotes.map(q => (
                <div key={q.id} style={{ ...card(), borderLeft: `3px solid ${G.accent}`, paddingLeft: 28 }}>
                  <p style={{ margin: '0 0 10px', fontSize: 17, lineHeight: 1.7, color: G.head, fontStyle: 'italic' }}>"{q.text}"</p>
                  {q.author && <div style={{ fontFamily: mono, fontSize: 11, color: G.mute, letterSpacing: '.08em' }}>— {q.author}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CUSTOM SECTIONS */}
        {visible.includes('custom') && customSections.map(cs => (
          <section key={cs.id} id={cs.section_key} style={{ marginBottom: 32 }}>
            <SLabel>{cs.title}</SLabel>
            <div style={card()}>
              <p style={{ margin: 0, lineHeight: 1.8, color: G.text, whiteSpace: 'pre-wrap', fontSize: 14 }}>{cs.content}</p>
            </div>
          </section>
        ))}

        {/* CONTACT */}
        {visible.includes('contact') && (
          <section id="contact" style={{ marginBottom: 32 }}>
            <SLabel>Contact</SLabel>
            <div style={{ ...card(), textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ fontFamily: sans, fontSize: 26, fontWeight: 700, color: G.head, marginBottom: 8 }}>Let's connect</div>
              <p style={{ color: G.mute, marginBottom: 24, fontSize: 14 }}>Open to new opportunities and collaborations.</p>
              {profile?.email_public && (
                <a href={`mailto:${profile.email_public}`} style={{
                  display: 'inline-block', padding: '12px 32px',
                  background: `linear-gradient(135deg,${G.accent},${G.accent2})`,
                  color: '#fff', borderRadius: 100, textDecoration: 'none',
                  fontWeight: 700, fontSize: 14, letterSpacing: '.04em',
                  boxShadow: `0 8px 24px ${G.accent}40`,
                }}>{profile.email_public}</a>
              )}
              {profile?.phone && <div style={{ marginTop: 16, fontFamily: mono, fontSize: 13, color: G.mute }}>{profile.phone}</div>}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
