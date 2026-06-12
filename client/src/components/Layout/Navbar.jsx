import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { logout } from '../../api/auth.js'
import { Link2, BarChart3, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '../UI/ThemeToggle.jsx'

export const Navbar = () => {
  const { user, isAuthenticated, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try { await logout() } catch {}
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 glass-card-static"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(5,8,22,0.8)'
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-sm group-hover:blur-md transition-all"
                style={{ background: 'rgba(139,92,246,0.4)' }} />
              <div className="relative p-2 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                <Link2 className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold gradient-text">Katomaran</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-violet-400"
                  style={{ color: 'var(--text-secondary)' }}>
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>

                <div className="h-4 w-px" style={{ background: 'var(--border-subtle)' }} />

                <ThemeToggle />

                <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: 'white' }}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {user?.name}
                    </span>
                  </div>
                  <button onClick={handleLogout}
                    className="p-1.5 rounded-lg transition-all hover:bg-rose-500/10"
                    style={{ color: 'var(--text-muted)' }}
                    title="Logout">
                    <LogOut className="h-4 w-4 hover:text-rose-400 transition-colors" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/login" className="text-sm font-medium transition-colors hover:text-violet-400"
                  style={{ color: 'var(--text-secondary)' }}>
                  Sign In
                </Link>
                <Link to="/register"
                  className="btn-cosmic px-4 py-2 text-sm rounded-xl font-medium text-white">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-xl transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.name}</span>
                    <ThemeToggle />
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Theme</span>
                    <ThemeToggle />
                  </div>
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}>
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-center btn-cosmic">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}