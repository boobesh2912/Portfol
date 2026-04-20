import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'

const LandingPage         = lazy(() => import('./pages/LandingPage'))
const LoginPage           = lazy(() => import('./pages/LoginPage'))
const SignupPage          = lazy(() => import('./pages/SignupPage'))
const DashboardLayout     = lazy(() => import('./components/layout/DashboardLayout'))
const EditorPage          = lazy(() => import('./pages/EditorPage'))
const AnalyticsPage       = lazy(() => import('./pages/AnalyticsPage'))
const SettingsPage        = lazy(() => import('./pages/SettingsPage'))
const PublicPortfolioPage = lazy(() => import('./pages/PublicPortfolioPage'))

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em' }}>
    LOADING…
  </div>
)

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return <Loader />
  if (!isSignedIn) return <Navigate to="/login" replace />
  return children
}

function AuthRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return <Loader />
  if (isSignedIn) return <Navigate to="/dashboard/editor" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard/editor" replace />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/:username" element={<PublicPortfolioPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
