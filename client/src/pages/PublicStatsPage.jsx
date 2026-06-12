import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MousePointer, Globe, BarChart3, Calendar, Link2, QrCode } from 'lucide-react'
import { getPublicStats } from '../api/analytics.js'
import { ClickChart } from '../components/Analytics/ClickChart.jsx'
import { DeviceChart, BrowserChart } from '../components/Analytics/Charts.jsx'
import { LoadingSpinner } from '../components/UI/LoadingSpinner.jsx'
import { format } from 'date-fns'

export default function PublicStatsPage() {
  const { shortCode } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-stats', shortCode],
    queryFn: () => getPublicStats(shortCode),
    select: d => d.data.stats
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="cosmic-bg">
          <div className="cosmic-stars" />
          <div className="cosmic-orb cosmic-orb-1" />
          <div className="cosmic-orb cosmic-orb-2" />
        </div>
        <LoadingSpinner size="lg" text="Loading stats..." />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4"
        style={{ background: 'var(--bg-base)' }}>
        <div className="cosmic-bg">
          <div className="cosmic-stars" />
          <div className="cosmic-orb cosmic-orb-1" />
        </div>
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Stats Not Found</h1>
        <p style={{ color: 'var(--text-secondary)' }}>This link doesn't exist or has no public stats.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="cosmic-bg">
        <div className="cosmic-stars" />
        <div className="cosmic-orb cosmic-orb-1" />
        <div className="cosmic-orb cosmic-orb-2" />
        <div className="cosmic-orb cosmic-orb-3" />
      </div>

      <div className="max-w-3xl mx-auto space-y-6 relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2.5 mb-8 justify-center">
            <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Katomaran Stats</span>
          </div>

          <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-default)' }}>
            <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {data.title || data.shortCode}
            </h1>
            <p className="text-sm text-violet-400 mb-1">/{data.customAlias || data.shortCode}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>→ {data.originalUrl}</p>

            <div className="flex flex-wrap gap-4 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Created {format(new Date(data.createdAt), 'MMM dd, yyyy')}</span>
              {data.lastVisited && <span>Last visit {format(new Date(data.lastVisited), 'MMM dd, yyyy')}</span>}
              {data.expiryDate && <span>Expires {format(new Date(data.expiryDate), 'MMM dd, yyyy')}</span>}
            </div>
          </div>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: MousePointer, label: 'Total Clicks', value: data.clickCount || 0, color: 'text-violet-400' },
            { icon: Globe, label: 'Countries', value: data.countryStats?.length || 0, color: 'text-cyan-400' }
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5" style={{ border: '1px solid var(--border-subtle)' }}>
              <Icon className={`h-5 w-5 mb-3 ${color}`} />
              <p className={`text-2xl font-bold mb-1 ${color}`}>{value.toLocaleString()}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* QR Code */}
        {data.qrCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4"
            style={{ border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2 self-start">
              <QrCode className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>QR Code</h2>
            </div>
            <div className="p-3 rounded-xl bg-white" style={{ boxShadow: '0 0 40px rgba(139,92,246,0.3)' }}>
              <img src={data.qrCode} alt="QR Code" className="w-40 h-40 rounded-lg" />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Scan to visit the link</p>
          </motion.div>
        )}

        {/* Click chart */}
        {data.dailyClicks?.length > 0 && (
          <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Daily Clicks</h2>
            </div>
            <ClickChart data={data.dailyClicks} />
          </div>
        )}

        {/* Device + Browser */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
            <h2 className="text-sm font-semibold mb-4 text-cyan-400">Devices</h2>
            <DeviceChart data={data.deviceStats || []} />
          </div>
          <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
            <h2 className="text-sm font-semibold mb-4 text-cyan-400">Browsers</h2>
            <BrowserChart data={data.browserStats || []} />
          </div>
        </div>

        {/* Countries */}
        {data.countryStats?.length > 0 && (
          <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
            <h2 className="text-sm font-semibold mb-4 text-pink-400">Top Countries</h2>
            <div className="space-y-2">
              {data.countryStats.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                  <span className="text-sm font-bold text-violet-400">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Powered by <span className="text-violet-400 font-medium">Katomaran Link Analytics</span>
        </p>
      </div>
    </div>
  )
}