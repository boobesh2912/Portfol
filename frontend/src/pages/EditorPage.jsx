import { useEffect, useState, useCallback } from 'react'
import { useProfileStore } from '../store/profileStore'
import { useEditorStore } from '../store/editorStore'
import OnboardingFlow from '../components/editor/OnboardingFlow'
import SectionPanel from '../components/editor/SectionPanel'
import EditorForm from '../components/editor/EditorForm'
import PortfolioPreview from '../components/editor/PortfolioPreview'
import { updateProfile } from '../api/profile'
import { updateSectionOrder, updateSectionVisibility, updateSectionSettings } from '../api/sections'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const TEMPLATES = [
  { key: 'editorial', label: 'Editorial',  icon: '✦' },
  { key: 'minimal',   label: 'Minimal',    icon: '◻' },
  { key: 'bold',      label: 'Bold',       icon: '◈' },
  { key: 'cardgrid',  label: 'Card Grid',  icon: '⊞' },
  { key: 'terminal',  label: 'Terminal',   icon: '>' },
  { key: 'magazine',  label: 'Magazine',   icon: '◎' },
  { key: 'anime',     label: 'Anime Editorial',   icon: '🌸' } ,
]

const ALL_SECTIONS = [
  { key: 'hero',           label: 'Hero' },
  { key: 'about',          label: 'About' },
  { key: 'skills',         label: 'Skills' },
  { key: 'projects',       label: 'Projects' },
  { key: 'experience',     label: 'Experience' },
  { key: 'education',      label: 'Education' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'services',       label: 'Services' },
  { key: 'testimonials',   label: 'Testimonials' },
  { key: 'books',          label: 'Books' },
  { key: 'publications',   label: 'Publications' },
  { key: 'quotes',         label: 'Quotes' },
  { key: 'contact',        label: 'Contact' },
  { key: 'custom',         label: 'Custom Section' },
]

const ANIMATIONS = ['none', 'fade', 'slide', 'zoom']

export default function EditorPage() {
  const { profile, sectionOrder, fetchProfile, setSectionOrder } = useProfileStore()
  const { activeSection, setActiveSection, onboardingComplete, setOnboardingComplete } = useEditorStore()
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [showLiveAlert, setShowLiveAlert] = useState(false)
  const [hiddenSections, setHiddenSections] = useState([])
  const [mobileTab, setMobileTab] = useState('form')
  const [showAddSection, setShowAddSection] = useState(false)
  const [settingsSection, setSettingsSection] = useState(null)
  const [sectionSettings, setSectionSettings] = useState({})
  const [savingSettings, setSavingSettings] = useState(false)
  const [sidebarTab, setSidebarTab] = useState('sections') // 'sections' | 'templates'

  useEffect(() => {
    if (profile?.hidden_sections) setHiddenSections(profile.hidden_sections)
    if (profile?.section_settings) setSectionSettings(profile.section_settings)
  }, [profile?.hidden_sections, profile?.section_settings])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sectionOrder.indexOf(active.id)
    const newIndex = sectionOrder.indexOf(over.id)
    const newOrder = arrayMove(sectionOrder, oldIndex, newIndex)
    setSectionOrder(newOrder)
    await updateSectionOrder(newOrder)
  }

  const handleTemplateChange = async (tpl) => {
    setSavingTemplate(true)
    try { await updateProfile({ template: tpl }); await fetchProfile() }
    finally { setSavingTemplate(false) }
  }

  const toggleSection = async (section) => {
    const newHidden = hiddenSections.includes(section)
      ? hiddenSections.filter(s => s !== section)
      : [...hiddenSections, section]
    setHiddenSections(newHidden)
    await updateSectionVisibility(newHidden)
  }

  const addSection = async (key) => {
    if (sectionOrder.includes(key)) return
    const newOrder = [...sectionOrder, key]
    setSectionOrder(newOrder)
    await updateSectionOrder(newOrder)
    setShowAddSection(false)
    setActiveSection(key)
    setMobileTab('form')
  }

  const saveSettings = async (section, settings) => {
    setSavingSettings(true)
    const updated = { ...sectionSettings, [section]: settings }
    setSectionSettings(updated)
    await updateSectionSettings(section, settings)
    setSavingSettings(false)
  }

  const handleOnboardingComplete = async () => {
    setOnboardingComplete(true)
    await fetchProfile()
    setShowLiveAlert(true)
    setTimeout(() => setShowLiveAlert(false), 6000)
  }

  if (!profile) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', background: 'var(--bg)', gap: 12 }}>
      <div>LOADING…</div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', opacity: 0.6, maxWidth: 260, textAlign: 'center', lineHeight: 1.7 }}>
        First load may take ~15s while the server wakes up.
      </div>
    </div>
  )

  // Show onboarding if user has never completed it AND has no meaningful profile data
  const hasProfileData = profile?.full_name || profile?.tagline || profile?.bio || profile?.template
  const isFirstVisit = !onboardingComplete && !hasProfileData
  if (isFirstVisit) return <OnboardingFlow onComplete={handleOnboardingComplete} />

  const currentTemplate = profile?.template || 'editorial'
  const availableToAdd = ALL_SECTIONS.filter(s => !sectionOrder.includes(s.key))
  const currentSettings = settingsSection ? (sectionSettings[settingsSection] || {}) : {}

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* Live alert */}
      {showLiveAlert && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-heading)', color: '#fff', fontSize: 13, fontWeight: 500,
          padding: '11px 24px', borderRadius: 100, zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,.15)',
        }}>
          Your portfolio is live!{' '}
          <a href={`/${profile.username}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-hover)', textDecoration: 'underline' }}>
            {window.location.host}/{profile.username}
          </a>
        </div>
      )}

      {/* Section settings drawer */}
      {settingsSection && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          background: 'rgba(0,0,0,.25)', backdropFilter: 'blur(4px)',
        }} onClick={() => setSettingsSection(null)}>
          <div style={{
            width: '100%', maxWidth: 480, background: 'var(--bg-card)',
            borderRadius: '16px 16px 0 0', padding: '24px 24px 32px', boxShadow: '0 -8px 40px rgba(0,0,0,.12)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--text-heading)', textTransform: 'capitalize' }}>{settingsSection} Settings</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '.06em' }}>Customize this section's appearance</div>
              </div>
              <button onClick={() => setSettingsSection(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>Background Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" value={currentSettings.bg_color || '#ffffff'} onChange={e => saveSettings(settingsSection, { ...currentSettings, bg_color: e.target.value })}
                    style={{ width: 36, height: 36, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }} />
                  <input value={currentSettings.bg_color || ''} onChange={e => saveSettings(settingsSection, { ...currentSettings, bg_color: e.target.value })}
                    placeholder="#ffffff" style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--text-heading)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>Accent Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" value={currentSettings.accent_color || '#c8884a'} onChange={e => saveSettings(settingsSection, { ...currentSettings, accent_color: e.target.value })}
                    style={{ width: 36, height: 36, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }} />
                  <input value={currentSettings.accent_color || ''} onChange={e => saveSettings(settingsSection, { ...currentSettings, accent_color: e.target.value })}
                    placeholder="#c8884a" style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--text-heading)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em' }}>Entrance Animation</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ANIMATIONS.map(anim => (
                  <button key={anim} onClick={() => saveSettings(settingsSection, { ...currentSettings, animation: anim })} style={{
                    padding: '6px 14px', borderRadius: 100, fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer',
                    background: (currentSettings.animation || 'none') === anim ? 'var(--accent)' : 'var(--bg-warm)',
                    color: (currentSettings.animation || 'none') === anim ? '#fff' : 'var(--text-muted)',
                    border: `1px solid ${(currentSettings.animation || 'none') === anim ? 'var(--accent)' : 'var(--border)'}`,
                    fontWeight: (currentSettings.animation || 'none') === anim ? 600 : 400,
                  }}>{anim}</button>
                ))}
              </div>
            </div>

            {savingSettings && <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.06em' }}>Saving…</div>}
          </div>
        </div>
      )}

      {/* Add section popover */}
      {showAddSection && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setShowAddSection(false)}>
          <div style={{
            position: 'absolute', left: 196, bottom: 60,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 8, boxShadow: '0 8px 32px rgba(0,0,0,.1)', minWidth: 180,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', padding: '4px 8px 8px', letterSpacing: '.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>Add Section</div>
            {availableToAdd.length === 0
              ? <div style={{ padding: '8px', fontSize: 12, color: 'var(--text-muted)' }}>All sections added</div>
              : availableToAdd.map(s => (
                <button key={s.key} onClick={() => addSection(s.key)} style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', border: 'none',
                  background: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: 'var(--text)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-warm)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                >{s.label}</button>
              ))
            }
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{
        height: 50, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', flexShrink: 0, gap: 12,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, fontStyle: 'italic', color: 'var(--text-heading)', flexShrink: 0 }}>Vizhva</span>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {[{ id: 'form', label: '✏ EDIT' }, { id: 'preview', label: '◎ PREVIEW' }].map(tab => (
              <button key={tab.id} onClick={() => setMobileTab(tab.id)} style={{
                padding: '6px 14px', fontFamily: 'var(--font-mono)', fontSize: 10.5, cursor: 'pointer',
                border: 'none', fontWeight: 700, letterSpacing: '.06em',
                background: mobileTab === tab.id ? 'var(--accent)' : 'var(--bg-card)',
                color: mobileTab === tab.id ? '#fff' : 'var(--text-muted)',
                transition: 'all .15s',
              }}>
                {tab.label}
              </button>
            ))}
          </div>
          <a href={`/${profile?.username}`} target="_blank" rel="noreferrer" style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
            color: 'var(--accent)', padding: '5px 12px', borderRadius: 7,
            border: '1px solid rgba(200,136,74,.35)', textDecoration: 'none', letterSpacing: '.05em',
          }}>VIEW LIVE ↗</a>
        </div>
      </div>

      {/* Main 3-panel body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT: sidebar with tab switcher for Sections / Templates */}
        <div style={{
          width: 196, background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
        }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            {[{ id: 'sections', label: 'Sections' }, { id: 'templates', label: 'Templates' }].map(tab => (
              <button key={tab.id} onClick={() => setSidebarTab(tab.id)} style={{
                flex: 1, padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 9.5,
                letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer',
                border: 'none', borderBottom: sidebarTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                background: 'transparent', color: sidebarTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: sidebarTab === tab.id ? 600 : 400,
              }}>{tab.label}</button>
            ))}
          </div>

          {sidebarTab === 'sections' ? (
            <>
              <div style={{ padding: '10px 12px 8px', flex: 1, overflowY: 'auto' }}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    {sectionOrder.map(section => {
                      const meta = ALL_SECTIONS.find(s => s.key === section)
                      return (
                        <SectionPanel
                          key={section} id={section}
                          label={meta ? meta.label : section.charAt(0).toUpperCase() + section.slice(1)}
                          isActive={activeSection === section}
                          isHidden={hiddenSections.includes(section)}
                          onSelect={() => { setActiveSection(section); setMobileTab('form') }}
                          onToggle={() => toggleSection(section)}
                          onSettings={() => setSettingsSection(section)}
                        />
                      )
                    })}
                  </SortableContext>
                </DndContext>
              </div>
              <div style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <button onClick={() => setShowAddSection(v => !v)} style={{
                  width: '100%', padding: '7px', fontFamily: 'var(--font-mono)', fontSize: 10.5,
                  color: 'var(--accent)', background: 'rgba(200,136,74,.06)', border: '1px dashed rgba(200,136,74,.35)',
                  borderRadius: 7, cursor: 'pointer', letterSpacing: '.05em',
                }}>+ Add Section</button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 16px' }}>
              {TEMPLATES.map(t => (
                <button key={t.key} onClick={() => handleTemplateChange(t.key)} style={{
                  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
                  border: `1px solid ${currentTemplate === t.key ? 'rgba(200,136,74,.5)' : 'transparent'}`,
                  background: currentTemplate === t.key ? 'rgba(200,136,74,.08)' : 'transparent',
                  transition: 'all .15s',
                }}
                  onMouseEnter={e => { if (currentTemplate !== t.key) e.currentTarget.style.background = 'var(--bg-warm)' }}
                  onMouseLeave={e => { if (currentTemplate !== t.key) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 13, color: currentTemplate === t.key ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: currentTemplate === t.key ? 600 : 400, color: currentTemplate === t.key ? 'var(--accent)' : 'var(--text-heading)' }}>{t.label}</div>
                  </div>
                  {currentTemplate === t.key && (
                    <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  )}
                </button>
              ))}
              {savingTemplate && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8, letterSpacing: '.06em' }}>Saving…</div>}
            </div>
          )}
        </div>

        {/* CENTER: live preview — full width, no box */}
        <div style={{
          flex: 1, overflow: 'auto', background: 'var(--bg-warm)',
          display: mobileTab === 'preview' || window.innerWidth > 900 ? 'block' : 'none',
        }}>
          {/* Browser chrome bar */}
          <div style={{ background: 'var(--bg-card)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
            {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
            <div style={{ flex: 1, background: 'var(--bg-warm)', borderRadius: 4, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginLeft: 8, maxWidth: 260 }}>
              {window.location.host}/{profile?.username}
            </div>
            <a href={`/${profile?.username}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '.05em' }}>OPEN ↗</a>
          </div>
          <PortfolioPreview template={currentTemplate} sectionSettings={sectionSettings} />
        </div>

        {/* RIGHT: edit form */}
        <div style={{
          width: 296, background: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
          flexShrink: 0, overflow: 'auto',
          display: mobileTab === 'form' || window.innerWidth > 900 ? 'flex' : 'none',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text-heading)', textTransform: 'capitalize' }}>{activeSection}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 3, letterSpacing: '.06em' }}>Changes reflect instantly in preview</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <EditorForm section={activeSection} />
          </div>
        </div>
      </div>
    </div>
  )
}
