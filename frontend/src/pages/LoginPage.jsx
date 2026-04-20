import { SignIn } from '@clerk/react'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'var(--font-body)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, fontStyle: 'italic', color: 'var(--text-heading)', marginBottom: 8 }}>Portfol</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Sign in to your account</div>
        </div>
        <SignIn
          forceRedirectUrl="/dashboard/editor"
          signUpUrl="/signup"
          appearance={{
            variables: {
              colorPrimary: '#c8884a',
              colorBackground: '#ffffff',
              colorInputBackground: '#fafaf8',
              colorInputText: '#1a1a18',
              colorText: '#5a5950',
              borderRadius: '8px',
              fontFamily: "'Outfit', sans-serif",
            },
            elements: {
              card: { boxShadow: '0 4px 32px rgba(0,0,0,.08)', border: '1px solid #e5e3de' },
              formButtonPrimary: { fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.06em', fontWeight: 600 },
            },
          }}
        />
      </div>
    </div>
  )
}
