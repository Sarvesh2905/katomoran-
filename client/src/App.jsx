import { useAuth } from './hooks/useAuth.js'
import AppRoutes from './routes/AppRoutes.jsx'
import { Toaster } from './components/UI/Toaster.jsx'
import { Link2 } from 'lucide-react'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'var(--bg-base)' }}>
        <div className="cosmic-bg">
          <div className="cosmic-stars" />
          <div className="cosmic-orb cosmic-orb-1" />
          <div className="cosmic-orb cosmic-orb-2" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl blur-xl"
            style={{ background: 'rgba(124,58,237,0.4)' }} />
          <div className="relative p-4 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <Link2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="flex gap-1.5">
          {[0, 0.15, 0.3].map(d => (
            <div key={d} className="h-2 w-2 rounded-full animate-bounce"
              style={{ background: '#8b5cf6', animationDelay: `${d}s` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Toaster>
      <AppRoutes />
    </Toaster>
  )
}

export default App