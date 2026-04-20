import { useEffect, useState } from 'react'
import { useProfileStore } from '../store/profileStore'
import { getMyAnalytics } from '../api/analytics'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const PIE_COLORS = ['#7c5cfc', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']

function BlurOverlay({ children }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none' }}>{children}</div>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,10,15,0.7)',
        backdropFilter: 'blur(2px)',
        borderRadius: 12,
        gap: 12,
      }}>
        <div style={{ fontSize: 20 }}>🔒</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-heading)' }}>Pro Analytics</div>
        <div style={{ fontSize: 13, color: 'var(--text)', maxWidth: 240, textAlign: 'center' }}>Countries, referrers, and device breakdown require Pro.</div>
        <Link to="/dashboard/settings" style={{ background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 8, textDecoration: 'none' }}>
          Upgrade to Pro — $5/mo
        </Link>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const { profile } = useProfileStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const isPro = profile?.is_pro

  useEffect(() => {
    getMyAnalytics().then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading analytics…</div>
  if (!data) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>No analytics data yet. Share your portfolio link to start tracking views!</div>

  const deviceData = Object.entries(data.device_breakdown || {}).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-heading)', marginBottom: 8, letterSpacing: -0.5 }}>Analytics</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 40 }}>
        {profile?.username && <span>portfol.me/{profile.username} · </span>}
        Last updated now
      </p>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total views', value: data.total_views ?? 0 },
          { label: 'Last 7 days', value: data.views_7d ?? 0 },
          { label: 'Last 30 days', value: data.views_30d ?? 0 },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '24px 28px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1 }}>{stat.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Sparkline / line chart — free tier */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '28px', border: '1px solid var(--border)', marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 20 }}>Views over time (30 days)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data.daily_views || []}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} interval={6} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={30} />
            <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="views" stroke="var(--accent)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pro stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

        {/* Top countries */}
        {isPro ? (
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 28, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 16 }}>Top countries</div>
            {(data.top_countries || []).length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No data yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.top_countries.map((c, i) => (
                  <div key={c.country} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 20 }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: 14, color: 'var(--text-heading)' }}>{c.country}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <BlurOverlay>
            <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 28, border: '1px solid var(--border)', height: 200 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 16 }}>Top countries</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['USA', 'India', 'Germany'].map(c => (
                  <div key={c} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span>{c}</span><span style={{ color: 'var(--accent)' }}>42</span>
                  </div>
                ))}
              </div>
            </div>
          </BlurOverlay>
        )}

        {/* Device breakdown */}
        {isPro ? (
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 28, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 16 }}>Device type</div>
            {deviceData.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No data yet</div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <PieChart width={140} height={140}>
                  <Pie data={deviceData} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value">
                    {deviceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {deviceData.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span style={{ color: 'var(--text)', textTransform: 'capitalize' }}>{d.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <BlurOverlay>
            <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 28, border: '1px solid var(--border)', height: 200 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 16 }}>Device type</div>
            </div>
          </BlurOverlay>
        )}
      </div>

      {/* Referrers */}
      {isPro ? (
        <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 28, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 16 }}>Top referrers</div>
          {(data.top_referrers || []).length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No data yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Source', 'Views'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, padding: '0 0 10px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.top_referrers.map(r => (
                  <tr key={r.referrer} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 0', fontSize: 14, color: 'var(--text-heading)' }}>{r.referrer}</td>
                    <td style={{ padding: '10px 0', fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <BlurOverlay>
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 28, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 16 }}>Top referrers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['linkedin.com', 'github.com', 'direct'].map(r => (
                <div key={r} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>{r}</span><span>23</span>
                </div>
              ))}
            </div>
          </div>
        </BlurOverlay>
      )}
    </div>
  )
}
