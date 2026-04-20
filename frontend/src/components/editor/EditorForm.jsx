import { useEffect, useState, useRef, useCallback } from 'react'
import { useProfileStore } from '../../store/profileStore'
import { updateProfile, uploadAvatar } from '../../api/profile'
import { upsertSkills, upsertSocialLinks } from '../../api/skills'
import { createProject, updateProject, deleteProject, uploadProjectImage } from '../../api/projects'
import {
  upsertExperiences, upsertEducations, upsertCertifications,
  upsertServices, upsertTestimonials,
  upsertBooks, upsertPublications, upsertQuotes, upsertCustomSections,
} from '../../api/sections'

// Skill categories for the picker
const SKILL_CATS = {
  'Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby', 'Dart'],
  'Frontend': ['React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'HTML', 'CSS', 'Tailwind', 'Redux', 'GraphQL'],
  'Backend': ['Node.js', 'FastAPI', 'Django', 'Flask', 'Express', 'Spring Boot', 'NestJS', 'tRPC'],
  'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'Prisma', 'Elasticsearch'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'CI/CD', 'GitHub Actions', 'Terraform'],
  'Mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'Expo'],
  'AI/ML': ['TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'Scikit-learn', 'Pandas', 'NumPy'],
  'Design': ['Figma', 'Adobe XD', 'UI/UX', 'Photoshop', 'Framer'],
  'Soft Skills': ['Leadership', 'Communication', 'Problem Solving', 'Agile', 'Scrum', 'Mentoring'],
}

function useDebounce(fn, delay) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

function SaveIndicator({ saving, saved }) {
  if (!saving && !saved) return null
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: saved ? 'var(--success)' : 'var(--text-muted)', marginBottom: 8, letterSpacing: '.08em' }}>
      {saving ? '● Saving…' : '✓ Saved'}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 5 }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{label}</label>
        {hint && <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const S = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 7, padding: '9px 12px', fontSize: 13, color: 'var(--text-heading)',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)',
}

const Btn = ({ onClick, disabled, children, variant = 'primary', style: extra }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: '8px 14px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: variant === 'danger' ? '1px solid rgba(239,68,68,.35)' : variant === 'ghost' ? '1px solid var(--border)' : 'none',
    background: variant === 'danger' ? 'transparent' : variant === 'ghost' ? 'transparent' : 'var(--accent)',
    color: variant === 'danger' ? '#ef4444' : variant === 'ghost' ? 'var(--text)' : '#fff',
    ...extra,
  }}>{children}</button>
)

// Generic list-section hook — handles local state + save
function useListEditor(storeItems, setter, saveFn) {
  const [items, setItems] = useState(storeItems)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => { setItems(storeItems) }, [storeItems])
  const update = (i, field, val) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it))
  const add = (empty) => setItems(prev => [...prev, empty])
  const remove = (i) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const save = async () => {
    setSaving(true)
    try {
      const res = await saveFn(items)
      setter(res)
      setSaved(true); setTimeout(() => setSaved(false), 1800)
    } finally { setSaving(false) }
  }
  return { items, update, add, remove, save, saving, saved }
}

export default function EditorForm({ section }) {
  const { profile, projects, skills, socialLinks, fetchProfile, updateProfile: updateStore,
    experiences, educations, certifications, services, testimonials,
    books, publications, quotes, customSections,
    setExperiences, setEducations, setCertifications, setServices, setTestimonials,
    setBooks, setPublications, setQuotes, setCustomSections,
  } = useProfileStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1800) }

  const persist = useDebounce(async (fields) => {
    setSaving(true)
    try { await updateProfile(fields); flash() } finally { setSaving(false) }
  }, 600)

  const handleField = (field, value) => {
    updateStore({ [field]: value })
    persist({ [field]: value })
  }

  if (!profile) return <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 13 }}>Loading…</div>

  // ── Hero ────────────────────────────────────────────────────
  if (section === 'hero') return (
    <div style={{ padding: 16 }}>
      <SaveIndicator saving={saving} saved={saved} />
      <Field label="Full name" hint="e.g. Boobesh AG">
        <input value={profile.full_name || ''} onChange={e => handleField('full_name', e.target.value)} style={S} placeholder="Your full name" />
      </Field>
      <Field label="Tagline" hint="one line below your name">
        <input value={profile.tagline || ''} onChange={e => handleField('tagline', e.target.value)} style={S} placeholder="Full Stack Developer · Open to work" />
      </Field>
      <Field label="Profile photo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-warm)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 18 }}>👤</span>
            }
          </div>
          <label style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', padding: '6px 12px', border: '1px solid var(--accent)', borderRadius: 7 }}>
            {saving ? 'Uploading…' : profile.avatar_url ? 'Change photo' : 'Upload photo'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
              if (!e.target.files[0]) return
              setSaving(true)
              await uploadAvatar(e.target.files[0])
              await fetchProfile()
              setSaving(false); flash()
            }} />
          </label>
        </div>
      </Field>
      <Field label="Visibility">
        <select value={profile.is_public ? 'public' : 'private'} onChange={e => handleField('is_public', e.target.value === 'public')} style={S}>
          <option value="public">Public — anyone can view</option>
          <option value="private">Private — only you</option>
        </select>
      </Field>
    </div>
  )

  // ── About ───────────────────────────────────────────────────
  if (section === 'about') return (
    <div style={{ padding: 16 }}>
      <SaveIndicator saving={saving} saved={saved} />
      <Field label="Bio" hint="2–4 sentences">
        <textarea value={profile.bio || ''} onChange={e => handleField('bio', e.target.value)} rows={6} style={{ ...S, resize: 'vertical' }}
          placeholder="I build fast, accessible web apps. 3 years professional experience. Passionate about open source and developer tools." />
      </Field>
      <Field label="Location" hint="e.g. Chennai, India">
        <input value={profile.location || ''} onChange={e => handleField('location', e.target.value)} style={S} placeholder="City, Country" />
      </Field>
      <Field label="Available for" hint="comma-separated">
        <input value={(profile.available_for || []).join(', ')} onChange={e => handleField('available_for', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} style={S}
          placeholder="Freelance, Full-time, Consulting, Contract" />
      </Field>
    </div>
  )

  // ── Contact ─────────────────────────────────────────────────
  if (section === 'contact') return <ContactEditor saving={saving} setSaving={setSaving} flash={flash} profile={profile} handleField={handleField} />

  // ── Skills ──────────────────────────────────────────────────
  if (section === 'skills') return <SkillsEditor flash={flash} />

  // ── Projects ────────────────────────────────────────────────
  if (section === 'projects') return <ProjectsEditor flash={flash} />

  // ── List sections ───────────────────────────────────────────
  if (section === 'experience')     return <ExperienceEditor     items={experiences}    setter={setExperiences}    saveFn={upsertExperiences} />
  if (section === 'education')      return <EducationEditor      items={educations}     setter={setEducations}     saveFn={upsertEducations} />
  if (section === 'certifications') return <CertificationsEditor items={certifications} setter={setCertifications} saveFn={upsertCertifications} />
  if (section === 'services')       return <ServicesEditor       items={services}       setter={setServices}       saveFn={upsertServices} />
  if (section === 'testimonials')   return <TestimonialsEditor   items={testimonials}   setter={setTestimonials}   saveFn={upsertTestimonials} />
  if (section === 'books')          return <BooksEditor          items={books}          setter={setBooks}          saveFn={upsertBooks} />
  if (section === 'publications')   return <PublicationsEditor   items={publications}   setter={setPublications}   saveFn={upsertPublications} />
  if (section === 'quotes')         return <QuotesEditor         items={quotes}         setter={setQuotes}         saveFn={upsertQuotes} />
  if (section === 'custom')         return <CustomSectionEditor  items={customSections} setter={setCustomSections} saveFn={upsertCustomSections} />

  return <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 13 }}>Select a section from the left to edit.</div>
}

// ── Contact ────────────────────────────────────────────────────

function ContactEditor({ saving, setSaving, flash, profile, handleField }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: saving ? 'var(--text-muted)' : 'var(--success)', marginBottom: 8, letterSpacing: '.08em' }}>
        {saving ? '● Saving…' : ''}
      </div>
      <Field label="Public email" hint="shown on your portfolio">
        <input value={profile.email_public || ''} onChange={e => handleField('email_public', e.target.value)} style={S} placeholder="you@example.com" />
      </Field>
      <Field label="Phone" hint="optional">
        <input value={profile.phone || ''} onChange={e => handleField('phone', e.target.value)} style={S} placeholder="+91 98765 43210" />
      </Field>
      <Field label="Location">
        <input value={profile.location || ''} onChange={e => handleField('location', e.target.value)} style={S} placeholder="Chennai, India" />
      </Field>
      <SocialsEditor flash={flash} />
    </div>
  )
}

// ── Skills ─────────────────────────────────────────────────────

function SkillsEditor({ flash }) {
  const { skills, fetchProfile } = useProfileStore()
  const [selected, setSelected] = useState(() => skills.map(s => s.name))
  const [input, setInput] = useState('')
  const [openCat, setOpenCat] = useState('Languages')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setSelected(skills.map(s => s.name)) }, [skills])

  const toggle = (sk) => setSelected(prev => prev.includes(sk) ? prev.filter(s => s !== sk) : [...prev, sk])

  const addCustom = () => {
    const s = input.trim()
    if (s && !selected.includes(s)) setSelected(prev => [...prev, s])
    setInput('')
  }

  const save = async () => {
    setSaving(true)
    await upsertSkills(selected)
    await fetchProfile()
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div style={{ padding: 16 }}>
      <SaveIndicator saving={saving} saved={saved} />

      {/* Selected pills */}
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12, padding: 10, background: 'var(--bg-warm)', borderRadius: 8, border: '1px solid var(--border)' }}>
          {selected.map(sk => (
            <span key={sk} style={{ fontSize: 12, padding: '3px 9px', background: 'rgba(200,136,74,.12)', color: 'var(--accent)', borderRadius: 100, border: '1px solid rgba(200,136,74,.3)', display: 'flex', gap: 4, alignItems: 'center' }}>
              {sk}
              <button onClick={() => toggle(sk)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, padding: 0, lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
        {Object.keys(SKILL_CATS).map(cat => (
          <button key={cat} onClick={() => setOpenCat(cat)} style={{
            padding: '3px 9px', borderRadius: 100, fontSize: 11, cursor: 'pointer',
            border: `1px solid ${openCat === cat ? 'var(--accent)' : 'var(--border)'}`,
            background: openCat === cat ? 'rgba(200,136,74,.08)' : 'transparent',
            color: openCat === cat ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight: openCat === cat ? 600 : 400,
          }}>{cat}</button>
        ))}
      </div>

      {/* Skills in category */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {SKILL_CATS[openCat].map(sk => {
          const sel = selected.includes(sk)
          return (
            <button key={sk} onClick={() => toggle(sk)} style={{
              padding: '4px 10px', borderRadius: 100, fontSize: 12, cursor: 'pointer',
              border: `1px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
              background: sel ? 'rgba(200,136,74,.1)' : 'var(--bg-card)',
              color: sel ? 'var(--accent)' : 'var(--text)',
              fontWeight: sel ? 600 : 400,
            }}>{sel ? '✓ ' : ''}{sk}</button>
          )
        })}
      </div>

      {/* Custom input */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Type custom skill + Enter" style={{ ...S, flex: 1 }} />
        <button onClick={addCustom} style={{ padding: '0 12px', background: 'var(--accent)', border: 'none', borderRadius: 7, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>+</button>
      </div>

      <Btn onClick={save} disabled={saving} style={{ width: '100%' }}>{saving ? 'Saving…' : 'Save skills'}</Btn>
    </div>
  )
}

// ── Projects ───────────────────────────────────────────────────

function ProjectsEditor({ flash }) {
  const { projects, fetchProfile } = useProfileStore()
  const [adding, setAdding] = useState(false)
  return (
    <div style={{ padding: 16 }}>
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} onSaved={() => { fetchProfile(); flash() }} />
      ))}
      <Btn variant="ghost" disabled={adding} onClick={async () => {
        setAdding(true)
        await createProject({ title: 'New Project', description: '', url: '' })
        await fetchProfile()
        setAdding(false)
      }} style={{ width: '100%', border: '1px dashed rgba(200,136,74,.4)', color: 'var(--accent)', background: 'none', marginTop: 4 }}>
        {adding ? 'Adding…' : '+ Add project'}
      </Btn>
    </div>
  )
}

function ProjectCard({ project, onSaved }) {
  const [title, setTitle] = useState(project.title)
  const [desc, setDesc] = useState(project.description || '')
  const [url, setUrl] = useState(project.url || '')
  const [saving, setSaving] = useState(false)
  const { setProjects, projects } = useProfileStore()

  const syncToStore = (field, value) =>
    setProjects(projects.map(p => p.id === project.id ? { ...p, [field]: value } : p))

  const save = async () => {
    setSaving(true)
    await updateProject(project.id, { title, description: desc, url })
    setSaving(false); onSaved()
  }

  return (
    <div style={{ background: 'var(--bg-warm)', borderRadius: 9, padding: 12, border: '1px solid var(--border)', marginBottom: 10 }}>
      {project.image_url && (
        <div style={{ marginBottom: 8, borderRadius: 6, overflow: 'hidden', height: 80 }}>
          <img src={project.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <input value={title} onChange={e => { setTitle(e.target.value); syncToStore('title', e.target.value) }} onBlur={save}
        placeholder="Project name — e.g. Portfolio Builder" style={{ ...S, marginBottom: 6 }} />
      <textarea value={desc} onChange={e => { setDesc(e.target.value); syncToStore('description', e.target.value) }} onBlur={save}
        rows={2} placeholder="What does it do? What tech did you use?" style={{ ...S, resize: 'vertical', marginBottom: 6 }} />
      <input value={url} onChange={e => { setUrl(e.target.value); syncToStore('url', e.target.value) }} onBlur={save}
        placeholder="https://github.com/you/project or live URL" style={{ ...S, marginBottom: 8 }} />
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <label style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', padding: '5px 10px', border: '1px solid rgba(200,136,74,.35)', borderRadius: 6, fontWeight: 500 }}>
          {saving ? 'Uploading…' : project.image_url ? '🖼 Change image' : '🖼 Add demo image'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
            if (!e.target.files[0]) return
            setSaving(true)
            await uploadProjectImage(project.id, e.target.files[0])
            onSaved(); setSaving(false)
          }} />
        </label>
        <Btn variant="danger" onClick={async () => {
          if (!confirm(`Delete "${project.title}"?`)) return
          await deleteProject(project.id); onSaved()
        }}>Delete</Btn>
      </div>
    </div>
  )
}

// ── Social Links ───────────────────────────────────────────────

function SocialsEditor({ flash }) {
  const { socialLinks, fetchProfile } = useProfileStore()
  const PLATFORMS = [
    { key: 'github',    label: 'GitHub',          ph: 'https://github.com/username' },
    { key: 'linkedin',  label: 'LinkedIn',         ph: 'https://linkedin.com/in/username' },
    { key: 'twitter',   label: 'Twitter / X',      ph: 'https://twitter.com/username' },
    { key: 'website',   label: 'Website',          ph: 'https://yoursite.com' },
    { key: 'dribbble',  label: 'Dribbble',         ph: 'https://dribbble.com/username' },
    { key: 'behance',   label: 'Behance',          ph: 'https://behance.net/username' },
    { key: 'youtube',   label: 'YouTube',          ph: 'https://youtube.com/@channel' },
    { key: 'instagram', label: 'Instagram',        ph: 'https://instagram.com/username' },
    { key: 'medium',    label: 'Medium',           ph: 'https://medium.com/@username' },
    { key: 'devto',     label: 'Dev.to',           ph: 'https://dev.to/username' },
  ]
  const init = {}
  PLATFORMS.forEach(p => { init[p.key] = '' })
  socialLinks.forEach(l => { init[l.platform] = l.url })
  const [links, setLinks] = useState(init)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const updated = { ...init }
    socialLinks.forEach(l => { updated[l.platform] = l.url })
    setLinks(updated)
  }, [socialLinks])

  const save = async () => {
    setSaving(true)
    const rows = Object.entries(links).filter(([, v]) => v).map(([platform, url]) => ({ platform, url }))
    await upsertSocialLinks(rows)
    await fetchProfile()
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 1800)
    flash && flash()
  }

  return (
    <div style={{ paddingTop: 8 }}>
      <SaveIndicator saving={saving} saved={saved} />
      {PLATFORMS.map(({ key, label, ph }) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</label>
          <input value={links[key]} onChange={e => setLinks({ ...links, [key]: e.target.value })} placeholder={ph} style={S} />
        </div>
      ))}
      <Btn onClick={save} disabled={saving} style={{ width: '100%', marginTop: 4 }}>{saving ? 'Saving…' : 'Save links'}</Btn>
    </div>
  )
}

// ── Generic list item wrapper ──────────────────────────────────

function ListWrapper({ children, saving, saved, onSave, onAdd, addLabel = '+ Add', saveLabel = 'Save' }) {
  return (
    <div style={{ padding: 16 }}>
      <SaveIndicator saving={saving} saved={saved} />
      {children}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <Btn variant="ghost" onClick={onAdd} style={{ flex: 1, border: '1px dashed rgba(200,136,74,.4)', color: 'var(--accent)', background: 'none' }}>{addLabel}</Btn>
        <Btn onClick={onSave} disabled={saving} style={{ flex: 1 }}>{saving ? 'Saving…' : saveLabel}</Btn>
      </div>
    </div>
  )
}

function ItemCard({ index, onRemove, children }) {
  return (
    <div style={{ background: 'var(--bg-warm)', borderRadius: 9, padding: 12, border: '1px solid var(--border)', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.06em' }}>#{index + 1}</span>
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>Remove</button>
      </div>
      {children}
    </div>
  )
}

// ── Experience ─────────────────────────────────────────────────

function ExperienceEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save} onAdd={() => add({ role: '', company: '', period: '', description: '' })}>
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <input value={it.role} onChange={e => update(i, 'role', e.target.value)} placeholder="Role — e.g. Senior Frontend Engineer" style={{ ...S, marginBottom: 6 }} />
          <input value={it.company} onChange={e => update(i, 'company', e.target.value)} placeholder="Company — e.g. Google, Startup XYZ" style={{ ...S, marginBottom: 6 }} />
          <input value={it.period || ''} onChange={e => update(i, 'period', e.target.value)} placeholder="Period — e.g. Jan 2022 – Present" style={{ ...S, marginBottom: 6 }} />
          <textarea value={it.description || ''} onChange={e => update(i, 'description', e.target.value)} rows={2} placeholder="What did you build or achieve?" style={{ ...S, resize: 'vertical' }} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}

// ── Education ──────────────────────────────────────────────────

function EducationEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save} onAdd={() => add({ degree: '', institution: '', period: '', description: '' })}>
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <input value={it.degree} onChange={e => update(i, 'degree', e.target.value)} placeholder="Degree — e.g. B.Tech Computer Science" style={{ ...S, marginBottom: 6 }} />
          <input value={it.institution} onChange={e => update(i, 'institution', e.target.value)} placeholder="Institution — e.g. IIT Madras" style={{ ...S, marginBottom: 6 }} />
          <input value={it.period || ''} onChange={e => update(i, 'period', e.target.value)} placeholder="Years — e.g. 2018 – 2022" style={{ ...S, marginBottom: 6 }} />
          <textarea value={it.description || ''} onChange={e => update(i, 'description', e.target.value)} rows={2} placeholder="Achievements, specialization (optional)" style={{ ...S, resize: 'vertical' }} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}

// ── Certifications ─────────────────────────────────────────────

function CertificationsEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save} onAdd={() => add({ name: '', issuer: '', year: '', url: '' })}>
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <input value={it.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Certificate — e.g. AWS Solutions Architect" style={{ ...S, marginBottom: 6 }} />
          <input value={it.issuer || ''} onChange={e => update(i, 'issuer', e.target.value)} placeholder="Issuer — e.g. Amazon Web Services" style={{ ...S, marginBottom: 6 }} />
          <input value={it.year || ''} onChange={e => update(i, 'year', e.target.value)} placeholder="Year — e.g. 2023" style={{ ...S, marginBottom: 6 }} />
          <input value={it.url || ''} onChange={e => update(i, 'url', e.target.value)} placeholder="Credential URL (optional)" style={S} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}

// ── Services ───────────────────────────────────────────────────

const ICONS = ['⚡', '🎨', '💻', '🔧', '📱', '🚀', '🔍', '📊', '✍️', '🎯', '🌐', '🤖', '🎓', '🛡️', '📸', '🎵']

function ServicesEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save} onAdd={() => add({ title: '', description: '', icon: '⚡' })}>
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.08em' }}>Icon</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {ICONS.map(ic => (
                <button key={ic} onClick={() => update(i, 'icon', ic)} style={{ width: 30, height: 30, border: `1px solid ${it.icon === ic ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 6, background: it.icon === ic ? 'rgba(200,136,74,.1)' : 'var(--bg-card)', cursor: 'pointer', fontSize: 14 }}>{ic}</button>
              ))}
            </div>
          </div>
          <input value={it.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Service — e.g. Web Development" style={{ ...S, marginBottom: 6 }} />
          <textarea value={it.description || ''} onChange={e => update(i, 'description', e.target.value)} rows={2} placeholder="Brief description of what you offer" style={{ ...S, resize: 'vertical' }} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}

// ── Testimonials ───────────────────────────────────────────────

function TestimonialsEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save} onAdd={() => add({ name: '', role: '', text: '', avatar_url: '' })}>
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <input value={it.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Person's name — e.g. Rahul Sharma" style={{ ...S, marginBottom: 6 }} />
          <input value={it.role || ''} onChange={e => update(i, 'role', e.target.value)} placeholder="Their title — e.g. CEO at Acme Corp" style={{ ...S, marginBottom: 6 }} />
          <textarea value={it.text} onChange={e => update(i, 'text', e.target.value)} rows={3} placeholder='"Working with them was exceptional…"' style={{ ...S, resize: 'vertical', marginBottom: 6 }} />
          <input value={it.avatar_url || ''} onChange={e => update(i, 'avatar_url', e.target.value)} placeholder="Avatar photo URL (optional)" style={S} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}

// ── Books ──────────────────────────────────────────────────────

function BooksEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save} onAdd={() => add({ title: '', author: '', year: '', url: '', notes: '' })} addLabel="+ Add book">
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <input value={it.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Book title — e.g. Clean Code" style={{ ...S, marginBottom: 6 }} />
          <input value={it.author || ''} onChange={e => update(i, 'author', e.target.value)} placeholder="Author — e.g. Robert C. Martin" style={{ ...S, marginBottom: 6 }} />
          <input value={it.year || ''} onChange={e => update(i, 'year', e.target.value)} placeholder="Year read — e.g. 2023" style={{ ...S, marginBottom: 6 }} />
          <input value={it.url || ''} onChange={e => update(i, 'url', e.target.value)} placeholder="Link (optional)" style={{ ...S, marginBottom: 6 }} />
          <input value={it.notes || ''} onChange={e => update(i, 'notes', e.target.value)} placeholder="Your takeaway (optional)" style={S} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}

// ── Publications ───────────────────────────────────────────────

function PublicationsEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save} onAdd={() => add({ title: '', publisher: '', year: '', url: '', description: '' })} addLabel="+ Add publication">
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <input value={it.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Title — e.g. Building LLM Pipelines" style={{ ...S, marginBottom: 6 }} />
          <input value={it.publisher || ''} onChange={e => update(i, 'publisher', e.target.value)} placeholder="Publisher — e.g. Medium, IEEE, Springer" style={{ ...S, marginBottom: 6 }} />
          <input value={it.year || ''} onChange={e => update(i, 'year', e.target.value)} placeholder="Year — e.g. 2024" style={{ ...S, marginBottom: 6 }} />
          <input value={it.url || ''} onChange={e => update(i, 'url', e.target.value)} placeholder="Link to publication" style={{ ...S, marginBottom: 6 }} />
          <textarea value={it.description || ''} onChange={e => update(i, 'description', e.target.value)} rows={2} placeholder="Abstract / summary (optional)" style={{ ...S, resize: 'vertical' }} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}

// ── Quotes ─────────────────────────────────────────────────────

function QuotesEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save} onAdd={() => add({ text: '', author: '' })} addLabel="+ Add quote">
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <textarea value={it.text} onChange={e => update(i, 'text', e.target.value)} rows={3} placeholder='"The best way to predict the future is to invent it."' style={{ ...S, resize: 'vertical', marginBottom: 6 }} />
          <input value={it.author || ''} onChange={e => update(i, 'author', e.target.value)} placeholder="Author — e.g. Alan Kay (or leave blank)" style={S} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}

// ── Custom Section ─────────────────────────────────────────────

function CustomSectionEditor({ items: storeItems, setter, saveFn }) {
  const { items, update, add, remove, save, saving, saved } = useListEditor(storeItems, setter, saveFn)
  return (
    <ListWrapper saving={saving} saved={saved} onSave={save}
      onAdd={() => add({ section_key: `custom_${Date.now()}`, section_label: 'My Section', content: '', items: [] })}
      addLabel="+ Add custom section"
    >
      <div style={{ marginBottom: 12, padding: '10px 12px', background: 'rgba(200,136,74,.06)', borderRadius: 8, border: '1px dashed rgba(200,136,74,.3)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Create any section you want — Awards, Talks, Hobbies, Open Source, Languages, Volunteer work, etc.
      </div>
      {items.map((it, i) => (
        <ItemCard key={i} index={i} onRemove={() => remove(i)}>
          <input value={it.section_label} onChange={e => update(i, 'section_label', e.target.value)} placeholder="Section name — e.g. Awards & Recognitions" style={{ ...S, marginBottom: 6, fontWeight: 600 }} />
          <textarea value={it.content || ''} onChange={e => update(i, 'content', e.target.value)} rows={5}
            placeholder={"List your items here, one per line:\n• Best App Award — Google 2024\n• Speaker at React Conf 2023\n• Open source contributor (500+ stars)"}
            style={{ ...S, resize: 'vertical', lineHeight: 1.6, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
        </ItemCard>
      ))}
    </ListWrapper>
  )
}
