/* Anime Editorial — FULL conversion from Editorial (no structure changes) */

const C = {
  bg: '#0a0a14',
  bgWarm: '#111122',
  bgCard: '#141426',

  border: '#23233a',
  border2: '#2f2f4a',

  text: '#cfcfff',
  textMid: '#9a9ad0',
  mute: '#6b6ba8',
  head: '#ffffff',

  accent: '#7c3aed',
  accentDim: 'rgba(124,58,237,0.12)',
  accentBdr: 'rgba(124,58,237,0.4)',

  glow: '0 0 25px rgba(124,58,237,0.35)',

  tag: '#111122',
}

const serif = "'Orbitron','Outfit',sans-serif"
const sans = "'Outfit','Inter',system-ui,sans-serif"
const mono = "'JetBrains Mono',monospace"

function Tag({ children }) {
  return (
    <span style={{
      fontFamily: mono,
      fontSize: 10.5,
      color: C.accent,
      background: C.tag,
      border: `1px solid ${C.border}`,
      padding: '4px 12px',
      borderRadius: 20,
      display: 'inline-block',
      boxShadow: C.glow
    }}>
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: mono,
      fontSize: 10,
      color: C.accent,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      marginBottom: 22,
      textShadow: C.glow
    }}>
      {children}
    </div>
  )
}

export default function AnimeEditorialTemplate(props) {

  const {
    profile, skills = [], projects = [], socialLinks = [], hiddenSections = [], sectionOrder = [],
    experiences = [], educations = [], certifications = [], services = [], testimonials = [],
    books = [], publications = [], quotes = [], customSections = [],
    sectionSettings = {},
  } = props

  const visible = (sectionOrder.length ? sectionOrder : ['hero','about','skills','projects','contact'])
    .filter(s => !hiddenSections.includes(s))

  const socials = {}
  socialLinks.forEach(l => socials[l.platform] = l.url)

  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Cyber Developer'

  const sStyle = (key) => {
    const s = sectionSettings[key] || {}
    return s.bg_color ? { background: s.bg_color } : {}
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: sans,
      color: C.text,
      fontSize: 14
    }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 240,
        background: C.bgCard,
        borderRight: `1px solid ${C.border}`,
        padding: '36px 22px',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div style={{
          fontFamily: serif,
          fontSize: 20,
          color: C.head,
          textShadow: C.glow
        }}>
          {name.split(' ')[0]}
        </div>

        <nav style={{ marginTop: 30 }}>
          {visible.map(s => (
            <a key={s} href={`#${s}`} style={{
              display: 'block',
              fontFamily: mono,
              fontSize: 10,
              color: C.mute,
              marginBottom: 10,
              textDecoration: 'none'
            }}>
              {s}
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1 }}>

        {/* HERO */}
        {visible.includes('hero') && (
          <section style={{
            padding: '72px 52px',
            borderBottom: `1px solid ${C.border}`,
            ...sStyle('hero')
          }}>
            <h1 style={{
              fontFamily: serif,
              fontSize: 'clamp(38px,5vw,60px)',
              color: C.head,
              textShadow: C.glow
            }}>
              {name}
            </h1>

            <p style={{
              color: C.textMid,
              marginTop: 10
            }}>
              {tagline}
            </p>
          </section>
        )}

        {/* ABOUT */}
        {visible.includes('about') && profile?.bio && (
          <section style={{ padding: 52 }}>
            <SectionLabel>About</SectionLabel>
            <p style={{ color: C.textMid }}>{profile.bio}</p>
          </section>
        )}

        {/* SKILLS */}
        {visible.includes('skills') && skills.length > 0 && (
          <section style={{ padding: 52 }}>
            <SectionLabel>Skills</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map(s => <Tag key={s.id || s.name}>{s.name}</Tag>)}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {visible.includes('experience') && experiences.length > 0 && (
          <section style={{ padding: 52 }}>
            <SectionLabel>Experience</SectionLabel>
            {experiences.map(e => (
              <div key={e.id} style={{ marginBottom: 20 }}>
                <h3>{e.role}</h3>
                <p style={{ color: C.accent }}>{e.company}</p>
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS */}
        {visible.includes('projects') && projects.length > 0 && (
          <section style={{ padding: 52 }}>
            <SectionLabel>Projects</SectionLabel>
            {projects.map(p => (
              <div key={p.id} style={{
                background: C.bgCard,
                padding: 20,
                border: `1px solid ${C.border}`,
                marginBottom: 12,
                boxShadow: C.glow
              }}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* CONTACT */}
        {visible.includes('contact') && (
          <section style={{ padding: 52 }}>
            <SectionLabel>Contact</SectionLabel>
            {profile?.email_public && <p>{profile.email_public}</p>}
          </section>
        )}

      </main>
    </div>
  )
}