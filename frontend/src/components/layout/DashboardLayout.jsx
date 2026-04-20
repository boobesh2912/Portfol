import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth, useUser, useClerk } from '@clerk/react'
import { useProfileStore } from '../../store/profileStore'
import { useEffect, useState } from 'react'
import { setTokenGetter } from '../../api/api'

export default function DashboardLayout() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { fetchProfile, profile, loading, error } = useProfileStore()
  const navigate = useNavigate()
  const [slowLoad, setSlowLoad] = useState(false)

  useEffect(() => {
    setTokenGetter(getToken)
    // Show "waking up" message if load takes > 4s (Render cold start)
    const slowTimer = setTimeout(() => setSlowLoad(true), 4000)
    fetchProfile().finally(() => {
      clearTimeout(slowTimer)
      setSlowLoad(false)
    })
    return () => clearTimeout(slowTimer)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { to: '/dashboard/editor',    label: 'Editor',    icon: '✦' },
    { to: '/dashboard/analytics', label: 'Analytics', icon: '◈' },
    { to: '/dashboard/settings',  label: 'Settings',  icon: '◎' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{
        width: 220, background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 0',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
      }}>
        <div style={{ padding: '0 24px 32px' }}>
          <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, fontStyle: 'italic', color: 'var(--text-heading)', letterSpacing: '-0.5px' }}>
            Portfol
          </a>
        </div>

        {profile && (
          <div style={{ padding: '0 24px 24px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '.06em', textTransform: 'uppercase' }}>Your portfolio</div>
            <a href={`/${profile.username}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
              portfol.me/{profile.username} ↗
            </a>
          </div>
        )}

        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, marginBottom: 2,
              fontSize: 14, fontWeight: 500,
              color: isActive ? 'var(--text-heading)' : 'var(--text)',
              background: isActive ? 'var(--bg-warm)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s',
            })}>
              <span style={{ fontSize: 11, color: 'var(--accent)' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            {user?.imageUrl && <img src={user.imageUrl} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>
          <button onClick={handleSignOut} style={{
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: 13, padding: '6px 12px',
            borderRadius: 6, cursor: 'pointer', width: '100%', marginBottom: 12,
          }}>Sign out</button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            A product from <span style={{ color: 'var(--accent)', fontWeight: 700 }}>GARI TECH</span>
          </div>
        </div>
      </aside>

      <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}
