import { useState, useRef, Suspense, lazy } from 'react'
import { useProfileStore } from '../../store/profileStore'
import { useEditorStore } from '../../store/editorStore'
import { updateProfile, uploadAvatar, checkUsername, updateUsername } from '../../api/profile'
import { upsertSkills, upsertSocialLinks } from '../../api/skills'
import { createProject } from '../../api/projects'

const EditorialTemplate = lazy(() => import('../../templates/EditorialTemplate'))
const MinimalTemplate   = lazy(() => import('../../templates/MinimalTemplate'))
const BoldTemplate      = lazy(() => import('../../templates/BoldTemplate'))
const CardGridTemplate  = lazy(() => import('../../templates/CardGridTemplate'))
const TerminalTemplate  = lazy(() => import('../../templates/TerminalTemplate'))
const MagazineTemplate  = lazy(() => import('../../templates/MagazineTemplate'))
const AnimeEditorialTemplate  = lazy(() => import('../../templates/AnimeEditorialTemplate'))  
const TEMPLATES = [
  { key: 'editorial', label: 'Editorial',  desc: 'Warm serif · amber · professional' },
  { key: 'minimal',   label: 'Minimal',    desc: 'Clean white canvas · Georgia' },
  { key: 'bold',      label: 'Bold',       desc: 'Dark · dramatic · big type' },
  { key: 'cardgrid',  label: 'Card Grid',  desc: 'Light masonry · hover effects' },
  { key: 'terminal',  label: 'Terminal',   desc: 'Green-on-dark · hacker style' },
  { key: 'magazine',  label: 'Magazine',   desc: 'Numbered editorial · serif' },
  { key: 'anime',     label: 'Anime Editorial',   desc: 'Soft pastel colors · playful' } ,    
]

// Skill categories with presets
const SKILL_CATS = {
  'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby', 'Dart', 'Scala'],
  'Frontend': ['React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'HTML', 'CSS', 'Tailwind', 'Sass', 'Redux', 'GraphQL'],
  'Backend': ['Node.js', 'FastAPI', 'Django', 'Flask', 'Express', 'Spring Boot', 'Laravel', 'Rails', 'NestJS', 'tRPC'],
  'Databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'Prisma', 'SQLite', 'Elasticsearch'],
  'DevOps & Cloud': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify', 'CI/CD', 'GitHub Actions', 'Terraform'],
  'Mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'Expo'],
  'AI & ML': ['TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'Scikit-learn', 'Pandas', 'NumPy', 'Hugging Face'],
  'Design': ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX', 'Framer'],
  'Soft Skills': ['Leadership', 'Communication', 'Team Player', 'Problem Solving', 'Critical Thinking', 'Mentoring', 'Agile', 'Scrum'],
}

function PreviewTemplate({ template, data }) {
  const props = {
    profile: data,
    skills: data._skills || [],
    projects: data._projects || [],
    socialLinks: data._socials || [],
    sectionOrder: ['hero', 'about', 'skills', 'projects', 'contact'],
    hiddenSections: [],
    experiences: [], educations: [], certifications: [], services: [], testimonials: [],
    sectionSettings: {},
  }
  switch (template) {
    case 'editorial': return <EditorialTemplate {...props} />
    case 'bold':      return <BoldTemplate {...props} />
    case 'cardgrid':  return <CardGridTemplate {...props} />
    case 'terminal':  return <TerminalTemplate {...props} />
    case 'magazine':  return <MagazineTemplate {...props} />
    default:          return <MinimalTemplate {...props} />
  }
}

const STEPS = ['Template', 'Identity', 'About', 'Skills', 'Projects', 'Socials', 'Your URL']

const TAGLINE_EXAMPLES = [
  'Full Stack Developer · Open to work',
  'Frontend Engineer · React & TypeScript',
  'Product Designer · UI/UX & Figma',
  'AI/ML Engineer · Python & LLMs',
  'Backend Developer · FastAPI & Go',
  'Mobile Developer · React Native',
  'DevOps Engineer · AWS & Docker',
  'Freelance Developer · Web & Mobile',
]

const BIO_EXAMPLES = [
  "I build fast, accessible web apps with React and Node.js. 3 years of professional experience. Open to remote roles.",
  "Product designer passionate about clean interfaces and intuitive UX. I've shipped apps used by 100k+ users.",
  "Full stack developer specializing in SaaS products. I love turning complex problems into simple, elegant solutions.",
  "AI/ML engineer with expertise in LLMs and production ML pipelines. Open source contributor.",
]

const IS = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text-heading)',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)',
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export default function OnboardingFlow({ onComplete }) {
  const { profile, fetchProfile } = useProfileStore()
  const { onboardingStep, setOnboardingStep } = useEditorStore()
  const [saving, setSaving] = useState(false)

  const [preview, setPreview] = useState({
    id: profile?.id,
    username: profile?.username || 'yourname',
    full_name: '',
    tagline: '',
    bio: '',
    avatar_url: '',
    template: 'editorial',
    is_public: true,
    is_pro: false,
    _skills: [],
    _projects: [{ id: 'p1', title: 'My Project', description: 'A project I built', url: '' }],
    _socials: [],
  })

  const update = (fields) => setPreview(p => ({ ...p, ...fields }))

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [openCat, setOpenCat] = useState('Programming Languages')
  const [projects, setProjects] = useState([{ title: '', description: '', url: '' }])
  const [socials, setSocials] = useState({ github: '', linkedin: '', twitter: '', website: '' })
  // Username step
  const [usernameInput, setUsernameInput] = useState(profile?.username || '')
  const [usernameStatus, setUsernameStatus] = useState('same')
  const [usernameSuggestions, setUsernameSuggestions] = useState([])
  const usernameTimer = useRef(null)

  const step = onboardingStep

  const toggleSkill = (skill) => {
    const next = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill]
    setSelectedSkills(next)
    update({ _skills: next.map((n, i) => ({ id: i, name: n })) })
  }

  const addCustomSkill = () => {
    const s = customSkillInput.trim()
    if (s && !selectedSkills.includes(s)) {
      const next = [...selectedSkills, s]
      setSelectedSkills(next)
      update({ _skills: next.map((n, i) => ({ id: i, name: n })) })
    }
    setCustomSkillInput('')
  }

  const handleUsernameCheck = (val) => {
    setUsernameInput(val)
    setUsernameStatus('checking')
    setUsernameSuggestions([])
    clearTimeout(usernameTimer.current)
    if (!val.trim()) { setUsernameStatus(null); return }
    if (val === profile?.username) { setUsernameStatus('same'); return }
    usernameTimer.current = setTimeout(async () => {
      try {
        const res = await checkUsername(val)
        if (res.error) { setUsernameStatus('invalid') }
        else if (res.available) { setUsernameStatus('available') }
        else { setUsernameStatus('taken'); setUsernameSuggestions(res.suggestions || []) }
      } catch { setUsernameStatus(null) }
    }, 500)
  }

  // Save everything at the last step — no per-step API calls
  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setOnboardingStep(step + 1)
      return
    }
    // Final step: save everything at once
    setSaving(true)
    try {
      await updateProfile({
        template: preview.template,
        full_name: preview.full_name,
        tagline: preview.tagline,
        bio: preview.bio,
        is_public: true,
      })
      if (avatarFile) await uploadAvatar(avatarFile)
      if (selectedSkills.length) await upsertSkills(selectedSkills)
      for (const p of projects) {
        if (p.title.trim()) await createProject(p)
      }
      const links = Object.entries(socials).filter(([, v]) => v).map(([platform, url]) => ({ platform, url }))
      if (links.length) await upsertSocialLinks(links)
      // Save username if changed and valid
      if (usernameInput && usernameInput !== profile?.username && (usernameStatus === 'available' || usernameStatus === 'same')) {
        try { await updateUsername(usernameInput.trim().toLowerCase()) } catch {}
      }
      await fetchProfile()
      onComplete()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => {
    if (step === STEPS.length - 1) {
      fetchProfile()
      onComplete()
    } else {
      setOnboardingStep(step + 1)
    }
  }

  const progress = Math.round((step / (STEPS.length - 1)) * 100)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* LEFT panel */}
      <div style={{ width: 420, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--bg-card)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, fontStyle: 'italic', color: 'var(--text-heading)' }}>Vizhva</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.1em' }}>Step {step + 1} of {STEPS.length}</span>
          </div>
          <div style={{ height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: i === step ? 'var(--accent)' : i < step ? 'var(--success)' : 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                {i < step ? '✓ ' : ''}{s}{i < STEPS.length - 1 ? ' ·' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

          {step === 0 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 6 }}>Pick your template</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>You can change this anytime. Live preview on the right →</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TEMPLATES.map(t => (
                  <button key={t.key} onClick={() => update({ template: t.key })} style={{
                    textAlign: 'left', padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                    border: `1px solid ${preview.template === t.key ? 'rgba(200,136,74,.5)' : 'var(--border)'}`,
                    background: preview.template === t.key ? 'rgba(200,136,74,.06)' : 'transparent',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: preview.template === t.key ? 'var(--accent)' : 'var(--text-heading)' }}>{t.label}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '.04em' }}>{t.desc}</div>
                    </div>
                    {preview.template === t.key && <span style={{ color: 'var(--accent)', fontSize: 16 }}>✦</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 6 }}>What's your name?</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>The headline of your portfolio.</p>
              <Field label="Full name" hint="e.g. Boobesh AG">
                <input value={preview.full_name} onChange={e => update({ full_name: e.target.value })} placeholder="Your full name" style={IS} />
              </Field>
              <Field label="Tagline" hint="one-liner below your name">
                <input value={preview.tagline} onChange={e => update({ tagline: e.target.value })} placeholder="Full Stack Developer · Open to work" style={{ ...IS, marginBottom: 8 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', letterSpacing: '.08em', marginBottom: 2 }}>EXAMPLES — click to use:</div>
                  {TAGLINE_EXAMPLES.map(ex => (
                    <button key={ex} onClick={() => update({ tagline: ex })} style={{
                      textAlign: 'left', padding: '6px 10px', borderRadius: 6, fontSize: 12,
                      border: '1px solid var(--border)', background: 'var(--bg-warm)', color: 'var(--text)',
                      cursor: 'pointer',
                    }}>{ex}</button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 6 }}>About you</h2>
              <Field label="Profile photo">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {avatarPreview
                      ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 22, color: 'var(--text-muted)' }}>👤</span>
                    }
                  </div>
                  <label style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer', padding: '7px 16px', border: '1px solid var(--accent)', borderRadius: 8, fontWeight: 500 }}>
                    Upload photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                      const f = e.target.files[0]
                      if (!f) return
                      setAvatarFile(f)
                      setAvatarPreview(URL.createObjectURL(f))
                      update({ avatar_url: URL.createObjectURL(f) })
                    }} />
                  </label>
                  {avatarPreview && (
                    <button onClick={() => { setAvatarFile(null); setAvatarPreview(''); update({ avatar_url: '' }) }}
                      style={{ fontSize: 12, color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                  )}
                </div>
              </Field>
              <Field label="Bio" hint="2–4 sentences">
                <textarea value={preview.bio} onChange={e => update({ bio: e.target.value })} rows={4} placeholder="Brief bio about who you are…" style={{ ...IS, resize: 'vertical', marginBottom: 8 }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', letterSpacing: '.08em', marginBottom: 4 }}>EXAMPLES — click to use:</div>
                {BIO_EXAMPLES.map((ex, i) => (
                  <button key={i} onClick={() => update({ bio: ex })} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6,
                    fontSize: 12, border: '1px solid var(--border)', background: 'var(--bg-warm)',
                    color: 'var(--text)', cursor: 'pointer', marginBottom: 4, lineHeight: 1.5,
                  }}>{ex}</button>
                ))}
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 6 }}>Your skills</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Select from categories or type your own. Mix hard + soft skills.</p>

              {/* Selected pills */}
              {selectedSkills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14, padding: '10px', background: 'var(--bg-warm)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  {selectedSkills.map(s => (
                    <span key={s} style={{ fontSize: 12, padding: '4px 10px', background: 'rgba(200,136,74,.12)', color: 'var(--accent)', borderRadius: 100, border: '1px solid rgba(200,136,74,.3)', display: 'flex', gap: 5, alignItems: 'center' }}>
                      {s}
                      <button onClick={() => toggleSkill(s)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Category tabs */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {Object.keys(SKILL_CATS).map(cat => (
                  <button key={cat} onClick={() => setOpenCat(cat)} style={{
                    padding: '4px 10px', borderRadius: 100, fontSize: 11, cursor: 'pointer',
                    border: `1px solid ${openCat === cat ? 'var(--accent)' : 'var(--border)'}`,
                    background: openCat === cat ? 'rgba(200,136,74,.08)' : 'transparent',
                    color: openCat === cat ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: openCat === cat ? 600 : 400,
                  }}>{cat}</button>
                ))}
              </div>

              {/* Skills in selected category */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                {SKILL_CATS[openCat].map(sk => {
                  const sel = selectedSkills.includes(sk)
                  return (
                    <button key={sk} onClick={() => toggleSkill(sk)} style={{
                      padding: '5px 11px', borderRadius: 100, fontSize: 12, cursor: 'pointer',
                      border: `1px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                      background: sel ? 'rgba(200,136,74,.1)' : 'var(--bg-card)',
                      color: sel ? 'var(--accent)' : 'var(--text)',
                      fontWeight: sel ? 600 : 400,
                    }}>{sel ? '✓ ' : ''}{sk}</button>
                  )
                })}
              </div>

              {/* Custom input */}
              <div style={{ display: 'flex', gap: 6 }}>
                <input value={customSkillInput} onChange={e => setCustomSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                  placeholder="Type custom skill + Enter" style={{ ...IS, flex: 1 }} />
                <button onClick={addCustomSkill} style={{ padding: '0 14px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>+</button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 6 }}>Your projects</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Show what you've built. Add images + links anytime from the editor.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projects.map((p, i) => (
                  <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: 14, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Project {i + 1}</div>
                    <input value={p.title} onChange={e => { const n = [...projects]; n[i] = { ...n[i], title: e.target.value }; setProjects(n); update({ _projects: n.filter(x => x.title).map((x, j) => ({ id: `p${j}`, ...x })) }) }}
                      placeholder="e.g. Portfolio Builder, E-commerce App, API Gateway" style={{ ...IS, marginBottom: 6 }} />
                    <textarea value={p.description} onChange={e => { const n = [...projects]; n[i] = { ...n[i], description: e.target.value }; setProjects(n); update({ _projects: n.filter(x => x.title).map((x, j) => ({ id: `p${j}`, ...x })) }) }}
                      placeholder="What does it do? What technologies did you use?" rows={2} style={{ ...IS, resize: 'vertical', marginBottom: 6 }} />
                    <input value={p.url} onChange={e => { const n = [...projects]; n[i] = { ...n[i], url: e.target.value }; setProjects(n) }}
                      placeholder="https://github.com/you/project" style={IS} />
                    {projects.length > 1 && (
                      <button onClick={() => setProjects(projects.filter((_, idx) => idx !== i))}
                        style={{ marginTop: 8, fontSize: 11, color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                    )}
                  </div>
                ))}
                <button onClick={() => setProjects([...projects, { title: '', description: '', url: '' }])} style={{ fontSize: 13, color: 'var(--accent)', background: 'none', border: '1px dashed rgba(200,136,74,.4)', borderRadius: 8, padding: '9px', cursor: 'pointer', fontWeight: 500 }}>
                  + Add another project
                </button>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 6 }}>Connect your profiles</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>All optional. Visitors can find you everywhere.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { key: 'github',   label: 'GitHub',           placeholder: 'https://github.com/username' },
                  { key: 'linkedin', label: 'LinkedIn',         placeholder: 'https://linkedin.com/in/username' },
                  { key: 'twitter',  label: 'Twitter / X',      placeholder: 'https://twitter.com/username' },
                  { key: 'website',  label: 'Personal website', placeholder: 'https://yoursite.com' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.1em' }}>{label}</label>
                    <input value={socials[key]} onChange={e => {
                      const next = { ...socials, [key]: e.target.value }
                      setSocials(next)
                      update({ _socials: Object.entries(next).filter(([, v]) => v).map(([platform, url], i) => ({ id: i, platform, url })) })
                    }} placeholder={placeholder} style={IS} />
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 6 }}>Your portfolio URL</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>This is the link you share with the world. You can change it anytime.</p>
              <div style={{ background: 'var(--bg-warm)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{window.location.host}/</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{usernameInput || profile?.username}</span>
              </div>
              <Field label="Choose your username">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', pointerEvents: 'none' }}>
                    {window.location.host}/
                  </span>
                  <input
                    value={usernameInput}
                    onChange={e => handleUsernameCheck(e.target.value)}
                    style={{ ...IS, paddingLeft: `${window.location.host.length * 7.5 + 20}px`, fontFamily: 'var(--font-mono)' }}
                    placeholder="your-username"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
                {usernameStatus && (
                  <div style={{ marginTop: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: { available: '#22c55e', taken: '#ef4444', invalid: '#ef4444', checking: '#9ca3af', same: '#9ca3af' }[usernameStatus] || 'transparent' }}>
                    {{ available: '✓ Available — great choice!', taken: '✗ Username is taken', invalid: '✗ Invalid format', checking: 'Checking…', same: '✓ Current username' }[usernameStatus]}
                  </div>
                )}
                {usernameStatus === 'taken' && usernameSuggestions.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>TRY ONE OF THESE:</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {usernameSuggestions.map(s => (
                        <button key={s} onClick={() => handleUsernameCheck(s)} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid var(--accent)', background: 'rgba(200,136,74,.08)', color: 'var(--accent)', cursor: 'pointer' }}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>Lowercase letters, numbers, hyphens, underscores. 3–30 chars.</div>
              </Field>
            </>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <button onClick={handleSkip} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.06em' }}>
            {step === STEPS.length - 1 ? 'Skip & finish' : 'Skip →'}
          </button>
          <button onClick={handleNext} disabled={saving} style={{
            background: 'var(--text-heading)', color: '#fff', border: 'none', borderRadius: 8,
            padding: '10px 26px', fontSize: 13, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Saving everything…' : step === STEPS.length - 1 ? 'Launch portfolio →' : 'Continue →'}
          </button>
        </div>
      </div>

      {/* RIGHT: live preview */}
      <div style={{ flex: 1, background: 'var(--bg-warm)', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 28px 40px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 16, alignSelf: 'flex-start' }}>
          Live Preview — updates as you type
        </div>
        <div style={{ width: '100%', maxWidth: 700, borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.1)', border: '1px solid var(--border)' }}>
          <div style={{ background: 'var(--bg-card)', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)' }}>
            {['#ef4444', '#f59e0b', '#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
            <div style={{ flex: 1, background: 'var(--bg-warm)', borderRadius: 4, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginLeft: 8, maxWidth: 200 }}>
              {window.location.host}/{preview.username}
            </div>
          </div>
          <div style={{ maxHeight: 'calc(100vh - 160px)', overflow: 'auto' }}>
            <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontSize: 12 }}>Loading…</div>}>
              <PreviewTemplate template={preview.template} data={preview} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
