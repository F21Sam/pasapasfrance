import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage       from '@/pages/LandingPage'
import LoginPage         from '@/pages/LoginPage'
import RegisterPage      from '@/pages/RegisterPage'
import OnboardingPage    from '@/pages/OnboardingPage'
import DashboardPage     from '@/pages/DashboardPage'
import DemarchesPage     from '@/pages/DemarchesPage'
import DemarcheDetail    from '@/pages/DemarcheDetail'
import DocumentsPage     from '@/pages/DocumentsPage'
import NotificationsPage from '@/pages/NotificationsPage'
import ProfilePage       from '@/pages/ProfilePage'
import AppLayout         from '@/components/layout/AppLayout'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"         element={<LandingPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
            <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route index                element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard"     element={<DashboardPage />} />
              <Route path="demarches"     element={<DemarchesPage />} />
              <Route path="demarches/:id" element={<DemarcheDetail />} />
              <Route path="documents"     element={<DocumentsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profil"        element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
