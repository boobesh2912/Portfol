/* Terminal — Hacker/dev aesthetic. CLI-style sections. */

const C = {
  bg: '#0d1117', bgCard: '#161b22', bgElev: '#1c2128',
  border: '#30363d', text: '#8b949e', head: '#e6edf3',
  green: '#3fb950', greenDim: 'rgba(63,185,80,.15)', greenBorder: 'rgba(63,185,80,.3)',
  blue: '#58a6ff', yellow: '#e3b341', orange: '#ffa657',
}
const mono = "'JetBrains Mono','Fira Code',monospace"

function Line({ prompt = '$', children, color }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
      <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>{prompt}</span>
      <span style={{ color: color || C.text }}>{children}</span>
    </div>
  )
}

function TSection({ id, title, children, sStyle }) {
  return (
    <section id={id} style={{ padding: '48px 52px', borderBottom: `1px solid ${C.border}`, ...sStyle }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <span style={{ color: C.green, fontSize: 11 }}>#</span>
        <h2 style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.green, letterSpacing: '.1em', textTransform: 'uppercase' }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      {children}
    </section>
  )
}

export default function TerminalTemplate({
  profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
  experiences = [], educations = [], certifications = [], services = [], testimonials = [],
  books = [], publications = [], quotes = [], customSections = [],
  sectionSettings = {},
}) {
  const visible = (sectionOrder.length ? sectionOrder : ['hero', 'about', 'skills', 'projects', 'contact']).filter(s => !hiddenSections.includes(s))
  const socials = {}
  socialLinks.forEach(l => { socials[l.platform] = l.url })
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Developer'
  const handle = name.toLowerCase().replace(/\s+/g, '')
  const sStyle = (key) => { const s = sectionSettings[key] || {}; return s.bg_color ? { background: s.bg_color } : {} }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: mono, minHeight: '100vh', fontSize: 13, lineHeight: 1.6 }}>

      <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: '0 24px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          <span style={{ fontSize: 11, color: C.text, marginLeft: 8 }}>bash — {handle}@portfolio: ~</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {visible.filter(s => s !== 'hero').slice(0, 6).map(s => (
            <a key={s} href={`#${s}`} style={{ fontSize: 11, color: C.text, textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => e.target.style.color = C.green}
              onMouseLeave={e => e.target.style.color = C.text}
            >./{s}</a>
          ))}
        </div>
      </div>

      {visible.includes('hero') && (
        <div style={{ padding: '56px 52px 48px', borderBottom: `1px solid ${C.border}`, ...sStyle('hero') }}>
          <div style={{ marginBottom: 24 }}>
            <Line prompt="~$">whoami</Line>
            <div style={{ marginLeft: 20, marginTop: 4 }}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: C.green, lineHeight: 1.2, marginBottom: 8 }}>{name}</div>
              <div style={{ color: C.blue, fontSize: 13 }}>{tagline}</div>
              {profile?.location && <div style={{ color: C.text, fontSize: 12, marginTop: 4 }}>📍 {profile.location}</div>}
            </div>
          </div>
          {profile?.bio && (
            <div style={{ marginTop: 20 }}>
              <Line prompt="~$">cat README.md</Line>
              <div style={{ marginLeft: 20, marginTop: 6, padding: '14px 18px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13, lineHeight: 1.75, maxWidth: 520 }}>
                {profile.bio}
              </div>
            </div>
          )}
          <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(socials).filter(([, v]) => v).slice(0, 4).map(([p, url]) => (
              <a key={p} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11, padding: '6px 14px', background: C.greenDim, border: `1px solid ${C.greenBorder}`, color: C.green, borderRadius: 4, textDecoration: 'none', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.color = C.bg }}
                onMouseLeave={e => { e.currentTarget.style.background = C.greenDim; e.currentTarget.style.color = C.green }}
              >{p} ↗</a>
            ))}
          </div>
        </div>
      )}

      {visible.includes('skills') && skills.length > 0 && (
        <TSection id="skills" title="skills.json" sStyle={sStyle('skills')}>
          <Line prompt="$">cat skills.json</Line>
          <div style={{ marginTop: 10, padding: '16px 20px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6 }}>
            <div style={{ color: C.text }}>{'{'}</div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: C.blue }}>"technologies"</span>
              <span style={{ color: C.text }}>: [</span>
              <div style={{ paddingLeft: 20, display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 6 }}>
                {skills.map((s, idx) => (
                  <span key={s.id || s.name} style={{ color: C.yellow, fontSize: 11 }}>"{s.name}"{idx < skills.length - 1 ? ',' : ''}</span>
                ))}
              </div>
              <span style={{ color: C.text }}>]</span>
            </div>
            <div style={{ color: C.text }}>{'}'}</div>
          </div>
        </TSection>
      )}

      {visible.includes('experience') && experiences.length > 0 && (
        <TSection id="experience" title="work_history" sStyle={sStyle('experience')}>
          <Line prompt="$">cat experience.log</Line>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 20 }}>
            {experiences.map((exp, i) => (
              <div key={exp.id || i} style={{ padding: '14px 18px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                <div style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>{exp.role}</div>
                <div style={{ color: C.blue, fontSize: 12, margin: '3px 0 8px' }}>{exp.company}{exp.period && <span style={{ color: C.text }}> · {exp.period}</span>}</div>
                {exp.description && <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7 }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        </TSection>
      )}

      {visible.includes('education') && educations.length > 0 && (
        <TSection id="education" title="education.log" sStyle={sStyle('education')}>
          <Line prompt="$">cat education.log</Line>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 20 }}>
            {educations.map((edu, i) => (
              <div key={edu.id || i} style={{ padding: '14px 18px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                <div style={{ color: C.yellow, fontWeight: 700, fontSize: 13 }}>{edu.degree}</div>
                <div style={{ color: C.blue, fontSize: 12, marginTop: 3 }}>{edu.institution}{edu.period && <span style={{ color: C.text }}> · {edu.period}</span>}</div>
                {edu.description && <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, marginTop: 6 }}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </TSection>
      )}

      {visible.includes('certifications') && certifications.length > 0 && (
        <TSection id="certifications" title="certs.json" sStyle={sStyle('certifications')}>
          <Line prompt="$">ls -la certs/</Line>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 20 }}>
            {certifications.map((cert, i) => (
              <div key={cert.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.greenBorder}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <div>
                  <span style={{ color: C.green, marginRight: 8 }}>▸</span>
                  <span style={{ color: C.head, fontWeight: 700 }}>{cert.name}</span>
                  {cert.issuer && <span style={{ color: C.text, fontSize: 11, marginLeft: 8 }}>({cert.issuer})</span>}
                  {cert.year && <span style={{ color: C.text, fontSize: 11, marginLeft: 6 }}>{cert.year}</span>}
                </div>
                {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: C.blue, textDecoration: 'none' }}>open ↗</a>}
              </div>
            ))}
          </div>
        </TSection>
      )}

      {visible.includes('services') && services.length > 0 && (
        <TSection id="services" title="services.sh" sStyle={sStyle('services')}>
          <Line prompt="$">cat services.sh</Line>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginLeft: 20 }}>
            {services.map((svc, i) => (
              <div key={svc.id || i} style={{ padding: '14px 18px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{svc.icon}</div>
                <div style={{ color: C.green, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{svc.title}</div>
                {svc.description && <p style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{svc.description}</p>}
              </div>
            ))}
          </div>
        </TSection>
      )}

      {visible.includes('testimonials') && testimonials.length > 0 && (
        <TSection id="testimonials" title="feedback.log" sStyle={sStyle('testimonials')}>
          <Line prompt="$">tail -n 50 feedback.log</Line>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 20 }}>
            {testimonials.map((t, i) => (
              <div key={t.id || i} style={{ padding: '14px 18px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 10 }}>// {t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} /> : <span style={{ color: C.green }}>@</span>}
                  <span style={{ color: C.orange, fontWeight: 700, fontSize: 12 }}>{t.name}</span>
                  {t.role && <span style={{ color: C.text, fontSize: 11 }}>· {t.role}</span>}
                </div>
              </div>
            ))}
          </div>
        </TSection>
      )}

      {visible.includes('projects') && projects.length > 0 && (
        <TSection id="projects" title="./projects" sStyle={sStyle('projects')}>
          <Line prompt="$">ls -la projects/</Line>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 20 }}>
            {projects.map((p, i) => (
              <div key={p.id} style={{ padding: '16px 18px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.greenBorder}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                {p.image_url && <img src={p.image_url} alt={p.title} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4, marginBottom: 12, border: `1px solid ${C.border}` }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ color: C.green, fontSize: 13 }}>▶</span>
                  <span style={{ color: C.head, fontWeight: 700, fontSize: 14 }}>{p.title}</span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: C.text, marginLeft: 'auto' }}>drwxr-xr-x</span>
                </div>
                {p.description && <p style={{ fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 10, paddingLeft: 23 }}>{p.description}</p>}
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.blue, textDecoration: 'none', paddingLeft: 23 }}>$ open {p.url.replace(/^https?:\/\//, '').split('/')[0]}</a>}
              </div>
            ))}
          </div>
        </TSection>
      )}

      {visible.includes('contact') && (
        <TSection id="contact" title="contact" sStyle={sStyle('contact')}>
          <Line prompt="$">./reach_me.sh</Line>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 20, maxWidth: 400 }}>
            {Object.entries(socials).filter(([, v]) => v).map(([p, url]) => (
              <a key={p} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.text, textDecoration: 'none', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.greenBorder; e.currentTarget.style.color = C.green }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text }}
              >
                <span style={{ color: C.green }}>→</span>
                <span style={{ flex: 1 }}>{p}</span>
                <span style={{ fontSize: 10, opacity: .5 }}>{url.replace(/^https?:\/\//, '').split('/')[0]}</span>
              </a>
            ))}
          </div>
        </TSection>
      )}

      {visible.includes('books') && books.length > 0 && (
        <section id="books" style={{ padding: '44px 52px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: C.green, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>$ cat books.txt</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {books.map((b, i) => (
              <div key={b.id||i} style={{ borderLeft: `2px solid ${C.border}`, paddingLeft: 16 }}>
                <span style={{ color: C.head, fontFamily: mono, fontSize: 13 }}>{b.title}</span>
                {b.author && <span style={{ color: C.mute, fontFamily: mono, fontSize: 11 }}> — {b.author}{b.year ? `, ${b.year}` : ''}</span>}
                {b.notes && <div style={{ color: C.text, fontSize: 12, marginTop: 4 }}>{b.notes}</div>}
                {b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ color: C.green, fontFamily: mono, fontSize: 10, textDecoration: 'none' }}>→ view</a>}
              </div>
            ))}
          </div>
        </section>
      )}
      {visible.includes('publications') && publications.length > 0 && (
        <section id="publications" style={{ padding: '44px 52px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: C.green, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>$ ls publications/</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {publications.map((p, i) => (
              <div key={p.id||i}>
                <div style={{ color: C.head, fontFamily: mono, fontSize: 14, fontWeight: 700 }}>{p.title}</div>
                {(p.publisher||p.year) && <div style={{ color: C.green, fontFamily: mono, fontSize: 10, marginBottom: 4 }}>{[p.publisher,p.year].filter(Boolean).join(' · ')}</div>}
                {p.description && <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{p.description}</div>}
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: C.green, fontFamily: mono, fontSize: 10, textDecoration: 'none' }}>→ read</a>}
              </div>
            ))}
          </div>
        </section>
      )}
      {visible.includes('quotes') && quotes.length > 0 && (
        <section id="quotes" style={{ padding: '44px 52px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: C.green, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>$ echo quotes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {quotes.map((q, i) => (
              <div key={q.id||i} style={{ borderLeft: `2px solid ${C.green}`, paddingLeft: 16 }}>
                <p style={{ color: C.head, fontFamily: mono, fontSize: 14, fontStyle: 'italic', marginBottom: 4 }}>"{q.text}"</p>
                {q.author && <span style={{ color: C.mute, fontFamily: mono, fontSize: 10 }}>— {q.author}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
      {visible.includes('custom') && customSections.map(cs => (
        <section key={cs.id} id={cs.section_key} style={{ padding: '44px 52px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: C.green, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>$ cat {cs.section_key}.txt</div>
          {cs.content && <p style={{ color: C.text, fontSize: 13, lineHeight: 1.8 }}>{cs.content}</p>}
          {Array.isArray(cs.items) && cs.items.map((item, i) => (
            <div key={i} style={{ color: C.text, fontFamily: mono, fontSize: 12, padding: '4px 0' }}>→ {typeof item==='string' ? item : JSON.stringify(item)}</div>
          ))}
        </section>
      ))}

      <div style={{ padding: '24px 52px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: C.green }}>$</span>
        <span style={{ color: C.text, fontSize: 11 }}>— {name} · Built with Vizhva</span>
        <span style={{ color: C.green }}>█</span>
      </div>
    </div>
  )
}
