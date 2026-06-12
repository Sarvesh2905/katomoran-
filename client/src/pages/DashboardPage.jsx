import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Upload, Link2, Globe, MousePointer, Activity, Zap, TrendingUp, Calendar } from 'lucide-react'
import { getLinks, deleteLink, updateLink } from '../api/links.js'
import { getGlobalAnalytics } from '../api/analytics.js'
import { Layout } from '../components/Layout/Layout.jsx'
import { LinkCard } from '../components/Link/LinkCard.jsx'
import { StatsCard } from '../components/Analytics/StatsCard.jsx'
import { LinkForm } from '../components/Link/LinkForm.jsx'
import { EditLinkModal } from '../components/Link/EditLinkModal.jsx'
import { BulkUploadModal } from '../components/Link/BulkUploadModal.jsx'
import { InsightCards } from '../components/Analytics/InsightCards.jsx'
import { Button } from '../components/UI/Button.jsx'
import { EmptyState } from '../components/UI/EmptyState.jsx'
import { SkeletonCard, SkeletonStatsCard } from '../components/UI/Skeletons.jsx'
import { useToast } from '../components/UI/Toaster.jsx'
import { useAuth } from '../hooks/useAuth.js'

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'clicks', label: 'Most Clicked' }
]
const STATUS_OPTIONS = ['all', 'active', 'expired', 'disabled']

export default function DashboardPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [showCreate, setShowCreate] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [page, setPage] = useState(1)

  const linksQuery = useQuery({
    queryKey: ['links', { search, status, sortBy, page }],
    queryFn: () => getLinks({
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      sortBy,
      page,
      limit: 20
    }),
    select: d => d.data
  })

  const globalQuery = useQuery({
    queryKey: ['global-analytics'],
    queryFn: getGlobalAnalytics,
    select: d => d.data.global
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries(['links'])
      queryClient.invalidateQueries(['global-analytics'])
      addToast('Link deleted', 'success')
    },
    onError: () => addToast('Failed to delete link', 'error')
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateLink(id, { status }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries(['links'])
      addToast(`Link ${status === 'active' ? 'enabled' : 'disabled'}`, 'success')
    },
    onError: () => addToast('Failed to update status', 'error')
  })

  const g = globalQuery.data
  const links = linksQuery.data?.links || []
  const pagination = linksQuery.data?.pagination

  return (
    <Layout>
      <div className="space-y-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              Welcome back, {user?.name?.split(' ')[0]} ✦
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {g ? `${g.totalLinks} links · ${g.totalClicks?.toLocaleString()} total clicks` : 'Loading your analytics...'}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setShowBulk(true)}>
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Bulk Upload
            </Button>
            <Button onClick={() => setShowCreate(true)} size="sm">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create Link
            </Button>
          </div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {globalQuery.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonStatsCard key={i} />)
          ) : (
            <>
              <StatsCard title="Total Links"    value={g?.totalLinks || 0}        icon={Link2}          iconColor="violet" delay={0}    />
              <StatsCard title="Total Clicks"   value={g?.totalClicks || 0}       icon={MousePointer}   iconColor="cyan"   delay={0.05} weeklyGrowth={g?.weeklyGrowth} monthlyGrowth={g?.monthlyGrowth} />
              <StatsCard title="Active Links"   value={g?.activeLinks || 0}       icon={Activity}       iconColor="emerald" delay={0.1} />
              <StatsCard title="Countries"      value={g?.countriesReached || 0}  icon={Globe}          iconColor="pink"   delay={0.15} />
              <StatsCard title="This Week"      value={g?.weeklyClicks || 0}      icon={Zap}            iconColor="amber"  delay={0.2}  weeklyGrowth={g?.weeklyGrowth} />
              <StatsCard title="This Month"     value={g?.monthlyClicks || 0}     icon={Calendar}       iconColor="cyan"   delay={0.25} monthlyGrowth={g?.monthlyGrowth} />
            </>
          )}
        </div>

        {/* ── SaaS Insights ── */}
        {g?.saasInsights?.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-sm font-semibold mb-3 gradient-text-violet flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Platform Insights
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.saasInsights.map((ins, i) => (
                <div key={i} className="glass-card rounded-xl p-3 flex items-center gap-3"
                  style={{ border: '1px solid var(--border-subtle)' }}>
                  <InsightCards insights={[ins]} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Filters + Search ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search links, aliases, URLs..."
              className="cosmic-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map(s => (
              <button key={s}
                onClick={() => { setStatus(s); setPage(1) }}
                className="px-3 py-2 text-xs font-medium rounded-xl transition-all capitalize"
                style={{
                  background: status === s ? 'rgba(139,92,246,0.2)' : 'var(--bg-card)',
                  color: status === s ? '#a78bfa' : 'var(--text-muted)',
                  border: status === s ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border-subtle)'
                }}>
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="cosmic-input px-3 py-2 text-xs rounded-xl"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* ── Links Grid ── */}
        <div>
          {linksQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : links.length === 0 ? (
            <EmptyState
              title={search ? 'No links found' : 'Create your first link'}
              description={search
                ? `No links match "${search}". Try a different search term.`
                : 'Shorten URLs, track clicks, and gain insights. Create your first link to get started.'}
              action={
                !search && (
                  <Button onClick={() => setShowCreate(true)}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create Your First Link
                  </Button>
                )
              }
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <AnimatePresence>
                  {links.map((link, i) => (
                    <LinkCard
                      key={link._id}
                      link={link}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onEdit={(link) => setEditingLink(link)}
                      onToggleStatus={(id, status) => toggleStatusMutation.mutate({ id, status })}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    ← Prev
                  </Button>
                  <span className="text-sm px-3" style={{ color: 'var(--text-muted)' }}>
                    {page} / {pagination.pages}
                  </span>
                  <Button variant="ghost" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <LinkForm isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <BulkUploadModal isOpen={showBulk} onClose={() => setShowBulk(false)} />
      {editingLink && (
        <EditLinkModal
          isOpen={!!editingLink}
          onClose={() => setEditingLink(null)}
          link={editingLink}
        />
      )}
    </Layout>
  )
}
