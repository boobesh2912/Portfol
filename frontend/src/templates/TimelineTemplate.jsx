/* TimelineTemplate — vertical CV/resume timeline style. Clean white, left timeline spine. Pro template. */

const T = {
  bg: '#fafafa', bgCard: '#ffffff', bgTag: '#f3f4f6',
  border: '#e5e7eb', text: '#374151', head: '#111827', mute: '#9ca3af',
  accent: '#2563eb', accentLight: '#eff6ff', accentBorder: '#bfdbfe',
  line: '#e5e7eb', dot: '#2563eb',
}
const sans = "'Outfit','Inter',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

function TimelineItem({ dot, children }) {
  return (
    <div style={{ display: 'flex', gap: 20, position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 18 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: dot || T.dot, border: `3px solid ${T.accentLight}`, flexShrink: 0, zIndex: 1, marginTop: 4 }} />
        <div style={{ flex: 1, width: 2, background: T.line, minHeight: 24, marginTop: 4 }} />
      </div>
      <div style={{ flex: 1, paddingBottom: 28 }}>{children}</div>
    </div>
  )
}

const SLabel = ({ children, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div style={{ width: 4, height: 24, background: accent || T.accent, borderRadius: 4, flexShrink: 0 }} />
    <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: T.head, letterSpacing: '.14em', textTransform: 'uppercase' }}>{children}</div>
  </div>
)

export default function TimelineTemplate({
  profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
  experiences = [], educations = [], certifications = [], services = [], testimonials = [],
  books = [], publications = [], quotes = [], customSections = [],
  sectionSettings = {},
}) {
  const visible = (sectionOrder.length ? sectionOrder : ['hero', 'about', 'skills', 'experience', 'education', 'projects', 'contact'])
    .filter(s => !hiddenSections.includes(s))
  const socials = {}
  socialLinks.forEach(l => { socials[l.platform] = l.url })
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Developer · Designer · Creator'

  return (
    <div style={{ minHeight: '100vh', fontFamily: sans, background: T.bg, color: T.text, fontSize: 14 }}>

      {/* Top header strip */}
      <header style={{ background: T.head, color: '#fff', padding: '0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px', display: 'flex', gap: 32, alignItems: 'center' }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt={name} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
            : <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>👤</div>}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 6px', fontSize: 36, fontWeight: 800, letterSpacing: -0.5 }}>{name}</h1>
            <div style={{ fontFamily: mono, fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: '.1em', marginBottom: 12 }}>{tagline}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {profile?.location && <span style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>📍 {profile.location}</span>}
              {profile?.email_public && <a href={`mailto:${profile.email_public}`} style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>✉ {profile.email_public}</a>}
              {profile?.phone && <span style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>☎ {profile.phone}</span>}
            </div>
          </div>
          {(profile?.available_for || []).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '6px 16px', flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontFamily: mono, fontSize: 11, color: '#4ade80' }}>{profile.available_for[0]}</span>
            </div>
          )}
        </div>
        {/* Nav strip */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', maxWidth: 900, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0 }}>
          {visible.filter(s => s !== 'hero').map(s => (
            <a key={s} href={`#${s}`} style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', padding: '12px 16px', borderBottom: '2px solid transparent', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderBottomColor = T.accent }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderBottomColor = 'transparent' }}
            >{s === 'custom' ? 'More' : s}</a>
          ))}
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, alignItems: 'start' }}>

          {/* LEFT: main timeline content */}
          <div>
            {/* ABOUT */}
            {visible.includes('about') && (
              <section id="about" style={{ marginBottom: 40 }}>
                <SLabel>About</SLabel>
                <p style={{ lineHeight: 1.8, color: T.text, fontSize: 15, margin: 0 }}>{profile?.bio || 'Tell your story here.'}</p>
              </section>
            )}

            {/* EXPERIENCE */}
            {visible.includes('experience') && experiences.length > 0 && (
              <section id="experience" style={{ marginBottom: 40 }}>
                <SLabel>Experience</SLabel>
                {experiences.map(exp => (
                  <TimelineItem key={exp.id}>
                    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div>
                          <div style={{ fontWeight: 700, color: T.head, fontSize: 15 }}>{exp.role}</div>
                          <div style={{ color: T.accent, fontSize: 13, marginTop: 2 }}>{exp.company}</div>
                        </div>
                        <div style={{ fontFamily: mono, fontSize: 10, color: T.mute, textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>{exp.period}</div>
                      </div>
                      {exp.description && <p style={{ margin: '8px 0 0', lineHeight: 1.7, color: T.text, fontSize: 13 }}>{exp.description}</p>}
                    </div>
                  </TimelineItem>
                ))}
              </section>
            )}

            {/* EDUCATION */}
            {visible.includes('education') && educations.length > 0 && (
              <section id="education" style={{ marginBottom: 40 }}>
                <SLabel>Education</SLabel>
                {educations.map(edu => (
                  <TimelineItem key={edu.id} dot="#7c3aed">
                    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: T.head, fontSize: 15 }}>{edu.degree}</div>
                      <div style={{ color: '#7c3aed', fontSize: 13, marginTop: 2 }}>{edu.institution}</div>
                      {edu.period && <div style={{ fontFamily: mono, fontSize: 10, color: T.mute, marginTop: 4 }}>{edu.period}</div>}
                      {edu.description && <p style={{ margin: '8px 0 0', lineHeight: 1.7, color: T.text, fontSize: 13 }}>{edu.description}</p>}
                    </div>
                  </TimelineItem>
                ))}
              </section>
            )}

            {/* PROJECTS */}
            {visible.includes('projects') && projects.length > 0 && (
              <section id="projects" style={{ marginBottom: 40 }}>
                <SLabel>Projects</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {projects.map(p => (
                    <div key={p.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
                      {p.image_url && <img src={p.image_url} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
                      <div style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div style={{ fontWeight: 700, color: T.head, fontSize: 16 }}>{p.title}</div>
                          {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, color: T.accent, textDecoration: 'none', flexShrink: 0, marginLeft: 12 }}>View →</a>}
                        </div>
                        {p.description && <p style={{ margin: '0 0 10px', lineHeight: 1.7, color: T.text, fontSize: 13 }}>{p.description}</p>}
                        {(p.tags || []).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                            {p.tags.map(tag => <span key={tag} style={{ fontFamily: mono, fontSize: 10, padding: '3px 9px', borderRadius: 100, background: T.accentLight, border: `1px solid ${T.accentBorder}`, color: T.accent }}>{tag}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TESTIMONIALS */}
            {visible.includes('testimonials') && testimonials.length > 0 && (
              <section id="testimonials" style={{ marginBottom: 40 }}>
                <SLabel>Testimonials</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {testimonials.map(t => (
                    <blockquote key={t.id} style={{ margin: 0, background: T.bgCard, border: `1px solid ${T.border}`, borderLeft: `4px solid ${T.accent}`, borderRadius: '0 10px 10px 0', padding: '18px 22px' }}>
                      <p style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.8, color: T.text, fontStyle: 'italic' }}>"{t.text}"</p>
                      <div style={{ fontWeight: 700, color: T.head, fontSize: 13 }}>{t.name}</div>
                      {t.role && <div style={{ fontSize: 12, color: T.mute }}>{t.role}</div>}
                    </blockquote>
                  ))}
                </div>
              </section>
            )}

            {/* PUBLICATIONS */}
            {visible.includes('publications') && publications.length > 0 && (
              <section id="publications" style={{ marginBottom: 40 }}>
                <SLabel>Publications</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {publications.map(p => (
                    <div key={p.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: T.head, fontSize: 15 }}>{p.title}</div>
                      {p.publisher && <div style={{ fontSize: 12, color: T.accent, marginTop: 3 }}>{p.publisher}</div>}
                      {p.year && <div style={{ fontFamily: mono, fontSize: 10, color: T.mute, marginTop: 2 }}>{p.year}</div>}
                      {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, color: T.accent, textDecoration: 'none', marginTop: 8, display: 'block' }}>Read →</a>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CUSTOM SECTIONS */}
            {visible.includes('custom') && customSections.map(cs => (
              <section key={cs.id} id={cs.section_key} style={{ marginBottom: 40 }}>
                <SLabel>{cs.section_label}</SLabel>
                <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: '20px 24px' }}>
                  <p style={{ margin: 0, lineHeight: 1.8, color: T.text, whiteSpace: 'pre-wrap' }}>{cs.content}</p>
                </div>
              </section>
            ))}
          </div>

          {/* RIGHT: sidebar */}
          <div style={{ position: 'sticky', top: 24 }}>

            {/* SKILLS */}
            {visible.includes('skills') && skills.length > 0 && (
              <div id="skills" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
                <SLabel>Skills</SLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map(s => (
                    <span key={s.id} style={{ fontFamily: mono, fontSize: 11, padding: '4px 11px', borderRadius: 100, background: T.accentLight, border: `1px solid ${T.accentBorder}`, color: T.accent }}>{s.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {visible.includes('certifications') && certifications.length > 0 && (
              <div id="certifications" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
                <SLabel>Certifications</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {certifications.map(c => (
                    <div key={c.id} style={{ paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
                      <div style={{ fontWeight: 600, color: T.head, fontSize: 13 }}>{c.name}</div>
                      {c.issuer && <div style={{ fontSize: 11, color: T.accent, marginTop: 2 }}>{c.issuer}</div>}
                      {c.year && <div style={{ fontFamily: mono, fontSize: 10, color: T.mute, marginTop: 2 }}>{c.year}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICES */}
            {visible.includes('services') && services.length > 0 && (
              <div id="services" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
                <SLabel>Services</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {services.map(s => (
                    <div key={s.id}>
                      <div style={{ fontWeight: 600, color: T.head, fontSize: 13 }}>{s.title}</div>
                      {s.description && <p style={{ margin: '4px 0 0', fontSize: 12, color: T.mute, lineHeight: 1.5 }}>{s.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOOKS */}
            {visible.includes('books') && books.length > 0 && (
              <div id="books" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
                <SLabel>Reading</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {books.map(b => (
                    <div key={b.id}>
                      <div style={{ fontWeight: 600, color: T.head, fontSize: 13 }}>{b.title}</div>
                      {b.author && <div style={{ fontSize: 11, color: T.mute }}>{b.author}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QUOTES */}
            {visible.includes('quotes') && quotes.length > 0 && (
              <div id="quotes" style={{ background: T.accentLight, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
                <SLabel>Quotes</SLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {quotes.map(q => (
                    <div key={q.id}>
                      <p style={{ margin: '0 0 6px', fontSize: 13, lineHeight: 1.7, color: T.head, fontStyle: 'italic' }}>"{q.text}"</p>
                      {q.author && <div style={{ fontFamily: mono, fontSize: 10, color: T.mute }}>— {q.author}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL */}
            {Object.keys(socials).length > 0 && (
              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: T.mute, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 }}>Links</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {Object.entries(socials).filter(([, v]) => v).map(([p, url]) => (
                    <a key={p} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 12, color: T.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >→ {p}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTACT — full width */}
        {visible.includes('contact') && (
          <section id="contact" style={{ marginTop: 48, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: '40px', textAlign: 'center' }}>
            <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 800, color: T.head, marginBottom: 8 }}>Get in touch</div>
            <p style={{ color: T.mute, marginBottom: 24, fontSize: 14 }}>Open to opportunities and collaborations.</p>
            {profile?.email_public && (
              <a href={`mailto:${profile.email_public}`} style={{
                display: 'inline-block', padding: '13px 36px',
                background: T.accent, color: '#fff', borderRadius: 10,
                textDecoration: 'none', fontWeight: 700, fontSize: 14, letterSpacing: '.02em',
              }}>{profile.email_public}</a>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
