import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, FileText, Copy, ExternalLink, MousePointer, Users, Clock, Heart, QrCode } from 'lucide-react'
import { getLink } from '../api/links.js'
import { getLinkAnalytics } from '../api/analytics.js'
import { Layout } from '../components/Layout/Layout.jsx'
import { StatsCard } from '../components/Analytics/StatsCard.jsx'
import { ClickChart } from '../components/Analytics/ClickChart.jsx'
import { DeviceChart, BrowserChart, ReferrerChart } from '../components/Analytics/Charts.jsx'
import { GeoTable } from '../components/Analytics/GeoTable.jsx'
import { InsightCards } from '../components/Analytics/InsightCards.jsx'
import { RecentVisitsTable } from '../components/Analytics/RecentVisitsTable.jsx'
import { QRModal } from '../components/Link/QRModal.jsx'
import { Badge } from '../components/UI/Badge.jsx'
import { Button } from '../components/UI/Button.jsx'
import { LoadingSpinner } from '../components/UI/LoadingSpinner.jsx'
import { SkeletonChart, SkeletonStatsCard } from '../components/UI/Skeletons.jsx'
import { useToast } from '../components/UI/Toaster.jsx'
import { getShortUrl } from '../utils/shortUrl.js'
import { exportToPDF, exportToCSV } from '../utils/exportUtils.js'
import { format } from 'date-fns'

export default function LinkDetailsPage() {
  const { id } = useParams()
  const { addToast } = useToast()
  const [days, setDays] = useState(7)
  const [showQR, setShowQR] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const linkQuery = useQuery({
    queryKey: ['link', id],
    queryFn: () => getLink(id),
    select: d => d.data.link
  })

  const analyticsQuery = useQuery({
    queryKey: ['analytics', id, days],
    queryFn: () => getLinkAnalytics(id, days),
    select: d => d.data.analytics,
    enabled: !!id
  })

  const link = linkQuery.data
  const analytics = analyticsQuery.data
  const shortUrl = link ? getShortUrl(link) : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      addToast('Short URL copied!', 'success')
    } catch {
      addToast('Failed to copy', 'error')
    }
  }

  const handleExportPDF = () => {
    if (!link || !analytics) return addToast('Analytics still loading', 'error')
    exportToPDF(link, analytics)
    addToast('PDF exported!', 'success')
  }

  const handleExportCSV = () => {
    if (!link || !analytics) return addToast('Analytics still loading', 'error')
    exportToCSV(link, analytics)
    addToast('CSV exported!', 'success')
  }

  const statusVariant = { active: 'success', expired: 'warning', disabled: 'danger' }

  if (linkQuery.isLoading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </Layout>
    )
  }

  if (!link) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Link not found</p>
          <Link to="/dashboard" className="text-violet-400 hover:text-violet-300 mt-4 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </Layout>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'traffic', label: 'Traffic' },
    { id: 'audience', label: 'Audience' },
    { id: 'visits', label: 'Recent Visits' }
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* ── Back + Header ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 text-sm mb-4 transition-colors hover:text-violet-400"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-default)' }}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {link.title || link.shortCode}
                  </h1>
                  <Badge variant={statusVariant[link.status] || 'default'}>{link.status}</Badge>
                  {link.health && (
                    <span className="text-xs font-medium text-violet-400">
                      ⚡ {link.health.label} ({link.health.score})
                    </span>
                  )}
                </div>

                <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors block mb-1">
                  {shortUrl}
                </a>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)', maxWidth: '500px' }}>
                  → {link.originalUrl}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>Created {format(new Date(link.createdAt), 'MMM dd, yyyy')}</span>
                  {link.expiryDate && <span>Expires {format(new Date(link.expiryDate), 'MMM dd, yyyy')}</span>}
                  {link.lastVisited && <span>Last visit {format(new Date(link.lastVisited), 'MMM dd HH:mm')}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy URL
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowQR(true)}>
                  <QrCode className="h-3.5 w-3.5 mr-1" /> QR Code
                </Button>
                <Button variant="secondary" size="sm" onClick={() => window.open(link.originalUrl, '_blank')}>
                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open
                </Button>
                <Button variant="secondary" size="sm" onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5 mr-1" /> CSV
                </Button>
                <Button size="sm" onClick={handleExportPDF}>
                  <FileText className="h-3.5 w-3.5 mr-1" /> PDF
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {analyticsQuery.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonStatsCard key={i} />)
          ) : (
            <>
              <StatsCard title="Total Clicks"    value={analytics?.totalClicks || 0}    icon={MousePointer} iconColor="violet" delay={0} />
              <StatsCard title="Unique Visitors" value={analytics?.uniqueVisitors || 0} icon={Users}        iconColor="cyan"   delay={0.05} />
              <StatsCard title="Health Score"    value={link.health?.score || 0}         icon={Heart}        iconColor="pink"   delay={0.1} />
              <StatsCard
                title="Last Visited"
                value={analytics?.lastVisited ? format(new Date(analytics.lastVisited), 'MMM dd') : 'Never'}
                icon={Clock}
                iconColor="amber"
                delay={0.15}
                isText
              />
            </>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'inline-flex' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.2))' : 'transparent',
                color: activeTab === tab.id ? '#a78bfa' : 'var(--text-muted)',
                border: activeTab === tab.id ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent'
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Click Chart */}
              <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-4 gradient-text-violet">Click Trends</h3>
                {analyticsQuery.isLoading
                  ? <SkeletonChart />
                  : <ClickChart data={analytics?.dailyClicks || []} onRangeChange={setDays} />
                }
              </div>

              {/* Insights */}
              {analytics?.insights?.length > 0 && (
                <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
                  <h3 className="text-sm font-semibold mb-4 gradient-text-violet">Smart Insights</h3>
                  <InsightCards insights={analytics.insights} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'traffic' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-4 text-cyan-400">Devices</h3>
                {analyticsQuery.isLoading ? <SkeletonChart height="h-48" /> : <DeviceChart data={analytics?.deviceStats || []} />}
              </div>
              <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-4 text-cyan-400">Browsers</h3>
                {analyticsQuery.isLoading ? <SkeletonChart height="h-48" /> : <BrowserChart data={analytics?.browserStats || []} />}
              </div>
              <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-4 text-pink-400">Referrers</h3>
                {analyticsQuery.isLoading ? <SkeletonChart height="h-48" /> : <ReferrerChart data={analytics?.referrerStats || []} />}
              </div>
            </div>
          )}

          {activeTab === 'audience' && (
            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-sm font-semibold mb-4 text-pink-400">Geographic Distribution (Top 10)</h3>
              {analyticsQuery.isLoading
                ? <SkeletonChart />
                : <GeoTable data={analytics?.countryStats || []} />
              }
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-sm font-semibold mb-4 gradient-text-violet">
                Recent Visits (Last 50)
              </h3>
              {analyticsQuery.isLoading
                ? <SkeletonChart />
                : <RecentVisitsTable visits={analytics?.recentVisits || []} />
              }
            </div>
          )}
        </motion.div>
      </div>

      <QRModal isOpen={showQR} onClose={() => setShowQR(false)} qrCode={link.qrCode} shortUrl={shortUrl} />
    </Layout>
  )
}