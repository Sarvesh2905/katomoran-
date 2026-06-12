import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link2, AlertTriangle, Clock, Power } from 'lucide-react'
import { Button } from '../components/UI/Button.jsx'
import { Toaster } from '../components/UI/Toaster.jsx'

const statusConfig = {
  expired: {
    icon: Clock,
    iconColor: '#fbbf24',
    iconBg: 'rgba(245,158,11,0.15)',
    title: 'Link Expired',
    message: 'This short link has expired and is no longer active.',
    sub: 'Contact the link creator to request a new link.'
  },
  disabled: {
    icon: Power,
    iconColor: '#f87171',
    iconBg: 'rgba(239,68,68,0.12)',
    title: 'Link Disabled',
    message: 'This short link has been temporarily disabled.',
    sub: 'The link owner may re-enable it at any time.'
  },
  notfound: {
    icon: AlertTriangle,
    iconColor: '#a78bfa',
    iconBg: 'rgba(139,92,246,0.15)',
    title: 'Link Not Found',
    message: 'This short link doesn\'t exist or may have been deleted.',
    sub: 'Double-check the URL and try again.'
  }
}

export default function LinkStatusPage() {
  const [params] = useSearchParams()
  const status = params.get('status') || 'notfound'
  const code = params.get('code')

  const config = statusConfig[status] || statusConfig.notfound
  const { icon: Icon, iconColor, iconBg, title, message, sub } = config

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'var(--bg-base)' }}>
      <div className="cosmic-bg">
        <div className="cosmic-stars" />
        <div className="cosmic-orb cosmic-orb-1" />
        <div className="cosmic-orb cosmic-orb-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-10 max-w-md w-full text-center"
        style={{ border: '1px solid var(--border-default)' }}
      >
        <div className="inline-flex items-center gap-2 mb-6 opacity-60">
          <Link2 className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-400">Katomaran</span>
        </div>

        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 rounded-2xl blur-xl"
            style={{ background: iconBg }} />
          <div className="relative p-5 rounded-2xl" style={{ background: iconBg }}>
            <Icon className="h-10 w-10" style={{ color: iconColor }} />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <p className="text-xs mb-8" style={{ color: 'var(--text-muted)' }}>{sub}</p>

        {code && (
          <p className="text-xs mb-6 px-3 py-2 rounded-lg"
            style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
            Short code: <span className="text-violet-400 font-mono">{code}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="secondary" onClick={() => window.history.back()}>
            ← Go Back
          </Button>
          <Link to="/register">
            <Button>Create Free Links →</Button>
          </Link>
        </div>
      </motion.div>
      <Toaster />
    </div>
  )
}
