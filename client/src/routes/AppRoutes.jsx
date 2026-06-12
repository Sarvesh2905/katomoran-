import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoginPage from '../pages/LoginPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import LinkDetailsPage from '../pages/LinkDetailsPage.jsx'
import PublicStatsPage from '../pages/PublicStatsPage.jsx'
import LinkStatusPage from '../pages/LinkStatusPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/register'} replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/links/:id" element={<ProtectedRoute><LinkDetailsPage /></ProtectedRoute>} />
      <Route path="/stats/:shortCode" element={<PublicStatsPage />} />
      <Route path="/link-status" element={<LinkStatusPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
