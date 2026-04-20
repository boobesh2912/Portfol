import { useProfileStore } from '../../store/profileStore'
import EditorialTemplate from '../../templates/EditorialTemplate'
import MinimalTemplate from '../../templates/MinimalTemplate'
import BoldTemplate from '../../templates/BoldTemplate'
import CardGridTemplate from '../../templates/CardGridTemplate'
import TerminalTemplate from '../../templates/TerminalTemplate'
import MagazineTemplate from '../../templates/MagazineTemplate'

export default function PortfolioPreview({ template, sectionSettings = {} }) {
  const {
    profile, skills, projects, socialLinks, sectionOrder,
    experiences, educations, certifications, services, testimonials,
    books, publications, quotes, customSections,
  } = useProfileStore()

  const data = {
    profile, skills, projects, socialLinks, sectionOrder,
    hiddenSections: profile?.hidden_sections || [],
    experiences, educations, certifications, services, testimonials,
    books, publications, quotes, customSections,
    sectionSettings,
  }

  if (!profile) return <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontFamily: 'monospace', fontSize: 12 }}>Loading preview…</div>

  switch (template) {
    case 'editorial': return <EditorialTemplate {...data} />
    case 'bold':      return <BoldTemplate {...data} />
    case 'cardgrid':  return <CardGridTemplate {...data} />
    case 'terminal':  return <TerminalTemplate {...data} />
    case 'magazine':  return <MagazineTemplate {...data} />
    default:          return <MinimalTemplate {...data} />
  }
}
