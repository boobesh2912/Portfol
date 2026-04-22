/* NeonTemplate — dark bg, electric blue/pink neon glow. Pro template. */

const N = {
  bg: '#050508', bgCard: '#0d0d14', bgElevated: '#12121e',
  border: '#1e1e30', text: '#c8c8d8', head: '#f0f0ff', mute: '#5a5a80',
  neonBlue: '#00d4ff', neonPink: '#ff2d78', neonPurple: '#b44dff',
  neonGreen: '#00ff87',
}
const sans = "'Outfit','Inter',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

const glow = (color, spread = 12) => `0 0 ${spread}px ${color}60, 0 0 ${spread * 3}px ${color}20`

const NeonBadge = ({ children, color }) => (
  <span style={{
    fontFamily: mono, fontSize: 11, padding: '4px 12px', borderRadius: 100,
    background: `${color}12`, border: `1px solid ${color}40`, color,
    letterSpacing: '.06em', textShadow: `0 0 8px ${color}80`,
  }}>{children}</span>
)

const SLabel = ({ children, color }) => {
  const c = color || N.neonBlue
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
      <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: c, textShadow: glow(c, 6) }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${c}50,transparent)` }} />
    </div>
  )
}

const Card = ({ children, accent, style = {} }) => {
  const c = accent || N.neonBlue
  return (
    <div style={{
      background: N.bgCard, border: `1px solid ${N.border}`,
      borderLeft: `2px solid ${c}`, borderRadius: 10,
      padding: '20px 24px', boxShadow: `inset 0 0 20px ${c}04`,
      ...style,
    }}>{children}</div>
  )
}

export default function NeonTemplate({
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

  const sectionAccent = (key) => {
    const map = { about: N.neonBlue, skills: N.neonPurple, experience: N.neonBlue, education: N.neonPink, projects: N.neonGreen, certifications: N.neonPurple, services: N.neonPink, testimonials: N.neonBlue, books: N.neonPurple, publications: N.neonBlue, quotes: N.neonPink, contact: N.neonGreen }
    return map[key] || N.neonBlue
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: sans, background: N.bg, color: N.text, fontSize: 14 }}>

      {/* Scanline effect overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* HERO */}
        {visible.includes('hero') && (
          <section id="hero" style={{ marginBottom: 64, textAlign: 'center', padding: '32px 0' }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={name} style={{
                  width: 96, height: 96, borderRadius: '50%', objectFit: 'cover',
                  border: `2px solid ${N.neonBlue}`, marginBottom: 24,
                  boxShadow: glow(N.neonBlue, 16),
                }} />
              : <div style={{
                  width: 96, height: 96, borderRadius: '50%', background: N.bgCard,
                  border: `2px solid ${N.neonBlue}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 36, margin: '0 auto 24px',
                  boxShadow: glow(N.neonBlue, 16),
                }}>👤</div>}

            <h1 style={{
              margin: '0 0 8px', fontSize: 52, fontWeight: 900, letterSpacing: -1.5,
              color: N.head, lineHeight: 1,
              textShadow: `0 0 40px ${N.neonBlue}30`,
            }}>{name}</h1>

            <div style={{ fontFamily: mono, fontSize: 13, color: N.neonBlue, letterSpacing: '.14em', marginBottom: 24, textShadow: glow(N.neonBlue, 8) }}>
              {tagline}
            </div>

            {(profile?.available_for || []).length > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: N.neonGreen, boxShadow: glow(N.neonGreen, 8) }} />
                <span style={{ fontFamily: mono, fontSize: 12, color: N.neonGreen, textShadow: glow(N.neonGreen, 6) }}>{profile.available_for[0]}</span>
              </div>
            )}

            {Object.keys(socials).length > 0 && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {Object.entries(socials).filter(([, v]) => v).map(([p, url]) => (
                  <a key={p} href={url} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: mono, fontSize: 11, color: N.mute, padding: '5px 16px',
                    border: `1px solid ${N.border}`, borderRadius: 100,
                    textDecoration: 'none', letterSpacing: '.08em', background: N.bgCard,
                    transition: 'all .2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = N.neonBlue; e.currentTarget.style.borderColor = N.neonBlue; e.currentTarget.style.boxShadow = glow(N.neonBlue, 6) }}
                    onMouseLeave={e => { e.currentTarget.style.color = N.mute; e.currentTarget.style.borderColor = N.border; e.currentTarget.style.boxShadow = 'none' }}
                  >{p}</a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ABOUT */}
        {visible.includes('about') && (
          <section id="about" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonBlue}>About</SLabel>
            <Card accent={N.neonBlue}>
              <p style={{ margin: 0, lineHeight: 1.8, color: N.text, fontSize: 15 }}>{profile?.bio || 'Tell your story here.'}</p>
              {profile?.location && <div style={{ marginTop: 14, fontFamily: mono, fontSize: 12, color: N.mute }}>📍 {profile.location}</div>}
            </Card>
          </section>
        )}

        {/* SKILLS */}
        {visible.includes('skills') && skills.length > 0 && (
          <section id="skills" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonPurple}>Skills</SLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map(s => <NeonBadge key={s.id} color={N.neonPurple}>{s.name}</NeonBadge>)}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {visible.includes('experience') && experiences.length > 0 && (
          <section id="experience" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonBlue}>Experience</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {experiences.map(exp => (
                <Card key={exp.id} accent={N.neonBlue}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: N.head, fontSize: 16 }}>{exp.title}</div>
                      <div style={{ color: N.neonBlue, fontSize: 13, marginTop: 2, textShadow: glow(N.neonBlue, 4) }}>{exp.company}</div>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: N.mute, textAlign: 'right' }}>{exp.start_date} — {exp.end_date || 'Present'}</div>
                  </div>
                  {exp.description && <p style={{ margin: '8px 0 0', lineHeight: 1.7, color: N.text, fontSize: 13 }}>{exp.description}</p>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {visible.includes('education') && educations.length > 0 && (
          <section id="education" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonPink}>Education</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {educations.map(edu => (
                <Card key={edu.id} accent={N.neonPink}>
                  <div style={{ fontWeight: 700, color: N.head, fontSize: 16 }}>{edu.degree}</div>
                  <div style={{ color: N.neonPink, fontSize: 13, marginTop: 2, textShadow: glow(N.neonPink, 4) }}>{edu.school}</div>
                  {edu.year && <div style={{ fontFamily: mono, fontSize: 10, color: N.mute, marginTop: 4 }}>{edu.year}</div>}
                  {edu.description && <p style={{ margin: '8px 0 0', lineHeight: 1.7, color: N.text, fontSize: 13 }}>{edu.description}</p>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {visible.includes('certifications') && certifications.length > 0 && (
          <section id="certifications" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonPurple}>Certifications</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
              {certifications.map(c => (
                <Card key={c.id} accent={N.neonPurple} style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, color: N.head, fontSize: 14 }}>{c.name}</div>
                  {c.issuer && <div style={{ color: N.neonPurple, fontSize: 12, marginTop: 3 }}>{c.issuer}</div>}
                  {c.year && <div style={{ fontFamily: mono, fontSize: 10, color: N.mute, marginTop: 3 }}>{c.year}</div>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {visible.includes('projects') && projects.length > 0 && (
          <section id="projects" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonGreen}>Projects</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
              {projects.map(p => (
                <div key={p.id} style={{ background: N.bgCard, border: `1px solid ${N.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = N.neonGreen; e.currentTarget.style.boxShadow = glow(N.neonGreen, 8) }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = N.border; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {p.image_url && <img src={p.image_url} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />}
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ fontWeight: 700, color: N.head, fontSize: 16, marginBottom: 6 }}>{p.title}</div>
                    {p.description && <p style={{ margin: '0 0 12px', fontSize: 13, lineHeight: 1.7, color: N.text }}>{p.description}</p>}
                    {(p.tags || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                        {p.tags.map(tag => <NeonBadge key={tag} color={N.neonGreen}>{tag}</NeonBadge>)}
                      </div>
                    )}
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, color: N.neonGreen, textDecoration: 'none', textShadow: glow(N.neonGreen, 4) }}>View project →</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES */}
        {visible.includes('services') && services.length > 0 && (
          <section id="services" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonPink}>Services</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
              {services.map(s => (
                <Card key={s.id} accent={N.neonPink} style={{ padding: '22px 24px' }}>
                  {s.icon && <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>}
                  <div style={{ fontWeight: 700, color: N.head, fontSize: 15, marginBottom: 8 }}>{s.title}</div>
                  {s.description && <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: N.text }}>{s.description}</p>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        {visible.includes('testimonials') && testimonials.length > 0 && (
          <section id="testimonials" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonBlue}>Testimonials</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {testimonials.map(t => (
                <Card key={t.id} accent={N.neonBlue}>
                  <p style={{ margin: '0 0 14px', fontSize: 15, lineHeight: 1.8, color: N.text, fontStyle: 'italic' }}>"{t.body}"</p>
                  <div style={{ fontWeight: 700, color: N.neonBlue, fontSize: 13, textShadow: glow(N.neonBlue, 4) }}>{t.author}</div>
                  {t.role && <div style={{ fontSize: 12, color: N.mute }}>{t.role}</div>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* BOOKS */}
        {visible.includes('books') && books.length > 0 && (
          <section id="books" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonPurple}>Books</SLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
              {books.map(b => (
                <Card key={b.id} accent={N.neonPurple} style={{ padding: '18px 20px' }}>
                  <div style={{ fontWeight: 700, color: N.head, fontSize: 14, marginBottom: 4 }}>{b.title}</div>
                  {b.author && <div style={{ fontSize: 12, color: N.neonPurple, textShadow: glow(N.neonPurple, 4) }}>{b.author}</div>}
                  {b.note && <p style={{ margin: '8px 0 0', fontSize: 12, lineHeight: 1.6, color: N.mute }}>{b.note}</p>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* PUBLICATIONS */}
        {visible.includes('publications') && publications.length > 0 && (
          <section id="publications" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonBlue}>Publications</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {publications.map(p => (
                <Card key={p.id} accent={N.neonBlue}>
                  <div style={{ fontWeight: 700, color: N.head, fontSize: 15 }}>{p.title}</div>
                  {p.venue && <div style={{ fontSize: 12, color: N.neonBlue, marginTop: 3 }}>{p.venue}</div>}
                  {p.year && <div style={{ fontFamily: mono, fontSize: 10, color: N.mute, marginTop: 3 }}>{p.year}</div>}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, color: N.neonBlue, textDecoration: 'none', marginTop: 8, display: 'block', textShadow: glow(N.neonBlue, 4) }}>Read →</a>}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* QUOTES */}
        {visible.includes('quotes') && quotes.length > 0 && (
          <section id="quotes" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonPink}>Quotes</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {quotes.map(q => (
                <div key={q.id} style={{ borderLeft: `2px solid ${N.neonPink}`, paddingLeft: 24, boxShadow: `-4px 0 16px ${N.neonPink}20` }}>
                  <p style={{ margin: '0 0 8px', fontSize: 18, lineHeight: 1.7, color: N.head, fontStyle: 'italic', textShadow: `0 0 20px ${N.neonPink}20` }}>"{q.text}"</p>
                  {q.author && <div style={{ fontFamily: mono, fontSize: 11, color: N.mute }}>— {q.author}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CUSTOM SECTIONS */}
        {visible.includes('custom') && customSections.map(cs => (
          <section key={cs.id} id={cs.section_key} style={{ marginBottom: 48 }}>
            <SLabel color={N.neonBlue}>{cs.title}</SLabel>
            <Card accent={N.neonBlue}>
              <p style={{ margin: 0, lineHeight: 1.8, color: N.text, whiteSpace: 'pre-wrap', fontSize: 14 }}>{cs.content}</p>
            </Card>
          </section>
        ))}

        {/* CONTACT */}
        {visible.includes('contact') && (
          <section id="contact" style={{ marginBottom: 48 }}>
            <SLabel color={N.neonGreen}>Contact</SLabel>
            <div style={{
              background: N.bgCard, border: `1px solid ${N.neonGreen}30`,
              borderRadius: 16, padding: '48px', textAlign: 'center',
              boxShadow: `0 0 48px ${N.neonGreen}08`,
            }}>
              <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 800, color: N.head, marginBottom: 8, textShadow: `0 0 32px ${N.neonGreen}20` }}>Let's build something</div>
              <p style={{ color: N.mute, marginBottom: 28, fontSize: 14 }}>Open to new projects and collaborations.</p>
              {profile?.email_public && (
                <a href={`mailto:${profile.email_public}`} style={{
                  display: 'inline-block', padding: '13px 36px',
                  background: 'transparent', border: `1px solid ${N.neonGreen}`,
                  color: N.neonGreen, borderRadius: 10, textDecoration: 'none',
                  fontWeight: 700, fontSize: 14, letterSpacing: '.04em',
                  boxShadow: glow(N.neonGreen, 12), textShadow: glow(N.neonGreen, 6),
                  transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${N.neonGreen}15` }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >{profile.email_public}</a>
              )}
              {profile?.phone && <div style={{ marginTop: 16, fontFamily: mono, fontSize: 13, color: N.mute }}>{profile.phone}</div>}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
