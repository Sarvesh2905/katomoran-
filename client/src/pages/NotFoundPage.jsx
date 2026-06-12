import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link2 } from 'lucide-react'
import { Button } from '../components/UI/Button.jsx'
import { Toaster } from '../components/UI/Toaster.jsx'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
      style={{ background: 'var(--bg-base)' }}>
      <div className="cosmic-bg">
        <div className="cosmic-stars" />
        <div className="cosmic-orb cosmic-orb-1" />
        <div className="cosmic-orb cosmic-orb-2" />
        <div className="cosmic-orb cosmic-orb-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl font-black mb-4 gradient-text"
        >
          404
        </motion.div>

        <div className="glass-card rounded-2xl p-8 mb-6" style={{ border: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-2 justify-center mb-4">
            <Link2 className="h-5 w-5 text-violet-400" />
            <span className="font-bold gradient-text">Katomaran</span>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Lost in Deep Space
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            The page you're looking for doesn't exist or has been moved to another galaxy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="secondary" onClick={() => window.history.back()}>
            ← Go Back
          </Button>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </motion.div>
      <Toaster />
    </div>
  )
}