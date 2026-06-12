import { Navbar } from './Navbar.jsx'
import { Toaster } from '../UI/Toaster.jsx'

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Cosmic background */}
      <div className="cosmic-bg">
        <div className="cosmic-stars" />
        <div className="cosmic-orb cosmic-orb-1" />
        <div className="cosmic-orb cosmic-orb-2" />
        <div className="cosmic-orb cosmic-orb-3" />
        <div className="cosmic-orb cosmic-orb-4" />
      </div>

      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  )
}