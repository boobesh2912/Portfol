import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicProfile } from '../api/profile'
import { recordView } from '../api/analytics'
import EditorialTemplate from '../templates/EditorialTemplate'
import MinimalTemplate from '../templates/MinimalTemplate'
import BoldTemplate from '../templates/BoldTemplate'
import CardGridTemplate from '../templates/CardGridTemplate'
import TerminalTemplate from '../templates/TerminalTemplate'
import MagazineTemplate from '../templates/MagazineTemplate'

export default function PublicPortfolioPage() {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getPublicProfile(username)
      .then(d => {
        setData(d)
        setLoading(false)
        // Record view — fire and forget
        recordView(username, document.referrer || 'direct')
        // SEO
        if (d?.profile) {
          document.title = `${d.profile.full_name || username} — Portfolio`
          setMeta('description', d.profile.bio || d.profile.tagline || `${username}'s portfolio`)
          setMeta('og:title', `${d.profile.full_name || username} — Portfolio`)
          setMeta('og:description', d.profile.bio || d.profile.tagline || '')
          if (d.profile.avatar_url) setMeta('og:image', d.profile.avatar_url)
          setMeta('og:type', 'website')
          setMeta('og:url', window.location.href)
        }
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })

    return () => {
      document.title = 'Portfol'
    }
  }, [username])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ color: '#aaa', fontSize: 14 }}>Loading…</div>
    </div>
  )

  if (notFound || !data) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafaf8', padding: 24, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 80, fontWeight: 600, color: '#e5e3de', marginBottom: 16, lineHeight: 1 }}>404</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: '#1a1a18', marginBottom: 8 }}>Portfolio not found</div>
      <div style={{ fontSize: 14, color: '#9a9890', marginBottom: 32 }}>{window.location.host}/{username} doesn't exist yet.</div>
      <Link to="/signup" style={{ background: '#1a1a18', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
        Claim this URL →
      </Link>
    </div>
  )

  const props = {
    profile: data.profile,
    skills: data.skills || [],
    projects: data.projects || [],
    socialLinks: data.social_links || [],
    sectionOrder: data.section_order || ['hero', 'about', 'skills', 'projects', 'contact'],
    hiddenSections: data.hidden_sections || [],
    experiences: data.experiences || [],
    educations: data.educations || [],
    certifications: data.certifications || [],
    services: data.services || [],
    testimonials: data.testimonials || [],
    books: data.books || [],
    publications: data.publications || [],
    quotes: data.quotes || [],
    customSections: data.custom_sections || [],
    sectionSettings: data.profile?.section_settings || {},
    isPublic: true,
  }

  const template = data.profile?.template || 'editorial'
  let TemplateComponent
  switch (template) {
    case 'editorial': TemplateComponent = EditorialTemplate; break
    case 'bold':      TemplateComponent = BoldTemplate; break
    case 'cardgrid':  TemplateComponent = CardGridTemplate; break
    case 'terminal':  TemplateComponent = TerminalTemplate; break
    case 'magazine':  TemplateComponent = MagazineTemplate; break
    default:          TemplateComponent = MinimalTemplate
  }

  return (
    <div>
      <TemplateComponent {...props} />
      <div style={{ textAlign: 'center', padding: '14px 16px', borderTop: '1px solid #e5e3de', background: '#fafaf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        {!data.profile?.is_pro && (
          <a href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#b0ae9e', textDecoration: 'none', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Built with <span style={{ color: '#c8884a', fontWeight: 600 }}>Portfol</span> · Get yours free
          </a>
        )}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#c8c6bc', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          A product from <span style={{ color: '#c8884a', fontWeight: 700 }}>GARI TECH</span>
        </span>
      </div>
    </div>
  )
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    const attr = name.startsWith('og:') ? 'property' : 'name'
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
