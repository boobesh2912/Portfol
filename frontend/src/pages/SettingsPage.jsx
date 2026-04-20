import { useState, useEffect, useRef } from 'react'
import { useProfileStore } from '../store/profileStore'
import { updateProfile, deleteAccount, checkUsername, updateUsername } from '../api/profile'
import { connectDomain, verifyDomain, removeDomain } from '../api/domain'
import { createCheckout, openPortal } from '../api/billing'
import { useNavigate } from 'react-router-dom'
import { useClerk } from '@clerk/react'

const SITE_BASE = 'portfol.me'

export default function SettingsPage() {
  const { profile, fetchProfile, updateProfile: updateLocalProfile } = useProfileStore()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [fullName, setFullName] = useState('')
  const [tagline, setTagline] = useState('')
  const [bio, setBio] = useState('')
  const [domain, setDomain] = useState('')
  const [dnsInstructions, setDnsInstructions] = useState(null)
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null)
  const [domainSaving, setDomainSaving] = useState(false)

  // Username state
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameStatus, setUsernameStatus] = useState(null) // null | 'checking' | 'available' | 'taken' | 'invalid' | 'same'
  const [usernameSuggestions, setUsernameSuggestions] = useState([])
  const [usernameError, setUsernameError] = useState('')
  const [usernameSaving, setUsernameSaving] = useState(false)
  const [usernameSaved, setUsernameSaved] = useState(false)
  const checkTimer = useRef(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setTagline(profile.tagline || '')
      setBio(profile.bio || '')
      setDomain(profile.custom_domain || '')
      setUsernameInput(profile.username || '')
    }
  }, [profile])

  const saveProfile = async () => {
    setSaving(true)
    try {
      await updateProfile({ full_name: fullName, tagline, bio })
      await fetchProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleUsernameChange = (val) => {
    setUsernameInput(val)
    setUsernameStatus('checking')
    setUsernameSuggestions([])
    setUsernameError('')
    clearTimeout(checkTimer.current)
    if (!val.trim()) { setUsernameStatus(null); return }
    if (val === profile?.username) { setUsernameStatus('same'); return }
    checkTimer.current = setTimeout(async () => {
      try {
        const res = await checkUsername(val)
        if (res.error) {
          setUsernameStatus('invalid')
          setUsernameError(res.error)
        } else if (res.available) {
          setUsernameStatus('available')
        } else {
          setUsernameStatus('taken')
          setUsernameSuggestions(res.suggestions || [])
        }
      } catch {
        setUsernameStatus(null)
      }
    }, 500)
  }

  const handleUsernameSave = async () => {
    if (usernameStatus !== 'available') return
    setUsernameSaving(true)
    try {
      await updateUsername(usernameInput.trim().toLowerCase())
      await fetchProfile()
      setUsernameSaved(true)
      setUsernameStatus('same')
      setTimeout(() => setUsernameSaved(false), 2000)
    } catch (e) {
      setUsernameError(e.message || 'Failed to update username')
      setUsernameStatus('taken')
    } finally {
      setUsernameSaving(false)
    }
  }

  const handleConnectDomain = async () => {
    if (!domain.trim()) return
    setDomainSaving(true)
    try {
      const res = await connectDomain(domain.trim())
      setDnsInstructions(res.dns_instructions)
    } finally {
      setDomainSaving(false)
    }
  }

  const handleVerifyDomain = async () => {
    setVerifying(true)
    try {
      const res = await verifyDomain()
      setVerifyResult(res.verified)
      if (res.verified) fetchProfile()
    } finally {
      setVerifying(false)
    }
  }

  const handleRemoveDomain = async () => {
    if (!confirm('Remove custom domain?')) return
    await removeDomain()
    setDomain('')
    setDnsInstructions(null)
    setVerifyResult(null)
    fetchProfile()
  }

  const handleDeleteAccount = async () => {
    if (!confirm('This will permanently delete your account and all portfolio data. Are you sure?')) return
    if (!confirm('Last chance. This cannot be undone.')) return
    await deleteAccount()
    await signOut()
    navigate('/')
  }

  const usernameStatusColor = {
    available: '#22c55e',
    taken: '#ef4444',
    invalid: '#ef4444',
    checking: '#9ca3af',
    same: '#9ca3af',
  }[usernameStatus] || 'transparent'

  const usernameStatusText = {
    available: '✓ Available',
    taken: '✗ Username is taken',
    invalid: '✗ ' + (usernameError || 'Invalid format'),
    checking: 'Checking…',
    same: 'Current username',
  }[usernameStatus] || ''

  const sectionStyle = {
    background: 'var(--bg-card)',
    borderRadius: 12,
    border: '1px solid var(--border)',
    padding: '32px',
    marginBottom: 24,
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-heading)', marginBottom: 40, letterSpacing: -0.5 }}>Settings</h1>

      {/* Profile */}
      <div style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 24 }}>Profile</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Full name">
            <input value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} placeholder="Your name" />
          </Field>
          <Field label="Tagline">
            <input value={tagline} onChange={e => setTagline(e.target.value)} style={inputStyle} placeholder="Full Stack Developer" />
          </Field>
          <Field label="Bio">
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="About you…" />
          </Field>
          <div>
            <button onClick={saveProfile} disabled={saving} style={btnPrimary}>
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio URL / Username */}
      <div style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 6 }}>Portfolio URL</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Your public portfolio is live at:
        </p>

        {/* Link display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>{SITE_BASE}/</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{profile?.username || '—'}</span>
          <a
            href={`https://${SITE_BASE}/${profile?.username}`}
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--accent)', textDecoration: 'none', border: '1px solid var(--accent)', borderRadius: 6, padding: '3px 10px' }}
          >
            Open ↗
          </a>
        </div>

        <Field label="Change username">
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              {/* Prefix display */}
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', pointerEvents: 'none', userSelect: 'none' }}>
                {SITE_BASE}/
              </div>
              <input
                value={usernameInput}
                onChange={e => handleUsernameChange(e.target.value)}
                style={{ ...inputStyle, paddingLeft: `${SITE_BASE.length * 7.5 + 20}px`, fontFamily: 'var(--font-mono)' }}
                placeholder="your-username"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <button
              onClick={handleUsernameSave}
              disabled={usernameStatus !== 'available' || usernameSaving}
              style={{ ...btnPrimary, opacity: usernameStatus === 'available' ? 1 : 0.5, cursor: usernameStatus === 'available' ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}
            >
              {usernameSaving ? 'Saving…' : usernameSaved ? '✓ Saved' : 'Save URL'}
            </button>
          </div>

          {/* Status row */}
          {usernameStatus && (
            <div style={{ marginTop: 8, fontSize: 12, color: usernameStatusColor, fontFamily: 'var(--font-mono)' }}>
              {usernameStatusText}
            </div>
          )}

          {/* Suggestions when taken */}
          {usernameStatus === 'taken' && usernameSuggestions.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: '.05em' }}>TRY ONE OF THESE:</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {usernameSuggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setUsernameInput(s); handleUsernameChange(s) }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid var(--accent)', background: 'rgba(200,136,74,.08)', color: 'var(--accent)', cursor: 'pointer' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            Lowercase letters, numbers, hyphens and underscores. 3–30 characters.
          </div>
        </Field>
      </div>

      {/* Custom Domain */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-heading)' }}>Custom Domain</h2>
          {!profile?.is_pro && (
            <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(124,92,252,0.15)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 100, border: '1px solid rgba(124,92,252,0.3)' }}>PRO</span>
          )}
        </div>
        <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 24 }}>Point your own domain to your portfolio. SSL is handled automatically.</p>

        {!profile?.is_pro ? (
          <div style={{ fontSize: 14, color: 'var(--text-muted)', padding: '12px 0' }}>
            Upgrade to Pro to use a custom domain.
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourdomain.com" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={handleConnectDomain} disabled={domainSaving} style={btnPrimary}>
                {domainSaving ? '…' : 'Connect'}
              </button>
              {profile?.custom_domain && (
                <button onClick={handleRemoveDomain} style={{ ...btnDanger, padding: '10px 16px' }}>Remove</button>
              )}
            </div>

            {profile?.domain_verified && (
              <div style={{ fontSize: 13, color: 'var(--success)', display: 'flex', gap: 6, alignItems: 'center' }}>
                ✓ Domain verified and active
              </div>
            )}

            {dnsInstructions && !profile?.domain_verified && (
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: 20, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 12 }}>Add this DNS record:</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Type', 'Name', 'Value'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0 0 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 0', color: 'var(--accent)', fontWeight: 600 }}>{dnsInstructions.type}</td>
                      <td style={{ padding: '8px 0', color: 'var(--text-heading)', fontFamily: 'monospace' }}>{dnsInstructions.name}</td>
                      <td style={{ padding: '8px 0', color: 'var(--text-heading)', fontFamily: 'monospace' }}>{dnsInstructions.value}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button onClick={handleVerifyDomain} disabled={verifying} style={btnPrimary}>
                    {verifying ? 'Checking…' : 'Verify DNS'}
                  </button>
                  {verifyResult === false && (
                    <span style={{ fontSize: 12, color: 'var(--error)' }}>DNS not resolved yet — may take up to 24h to propagate.</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Billing */}
      <div style={sectionStyle}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 8 }}>Billing</h2>
        {profile?.is_pro ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 100, border: '1px solid rgba(34,197,94,0.3)' }}>
                ✓ Pro Plan Active
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 16 }}>Manage your subscription, update payment details, or cancel anytime.</p>
            <button onClick={() => openPortal()} style={btnPrimary}>Manage Billing</button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>You're on the <strong style={{ color: 'var(--text-heading)' }}>Free</strong> plan.</p>
            <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 20 }}>Upgrade to Pro for custom domains, advanced analytics, and no branding — $5/month.</p>
            <button onClick={() => createCheckout()} style={{ ...btnPrimary, background: 'var(--accent)', boxShadow: '0 0 20px rgba(124,92,252,0.3)' }}>
              Upgrade to Pro — $5/mo
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div style={{ ...sectionStyle, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>Danger Zone</h2>
        <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 16 }}>Permanently delete your account and all portfolio data. This cannot be undone.</p>
        <button onClick={handleDeleteAccount} style={btnDanger}>Delete my account</button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '11px 14px',
  fontSize: 14,
  color: 'var(--text-heading)',
  outline: 'none',
  boxSizing: 'border-box',
}

const btnPrimary = {
  background: 'var(--bg-elevated)',
  color: 'var(--text-heading)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}

const btnDanger = {
  background: 'rgba(239,68,68,0.1)',
  color: '#ef4444',
  border: '1px solid rgba(239,68,68,0.3)',
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}
