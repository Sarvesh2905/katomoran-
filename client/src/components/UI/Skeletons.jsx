export const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-5" style={{ border: '1px solid var(--border-subtle)' }}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1 space-y-2">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
      </div>
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
    <div className="skeleton h-4 w-40 mb-3" />
    <div className="flex items-center gap-4">
      <div className="skeleton h-3.5 w-20" />
      <div className="skeleton h-3.5 w-24" />
      <div className="skeleton h-3.5 w-16 rounded-full" />
    </div>
  </div>
)

export const SkeletonChart = ({ height = 'h-64' }) => (
  <div className={`${height} w-full rounded-xl skeleton`} />
)

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-2">
    <div className="skeleton h-10 w-full rounded-lg" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton rounded-lg" style={{ height: '40px', opacity: 1 - i * 0.12 }} />
    ))}
  </div>
)

export const SkeletonStatsCard = () => (
  <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid var(--border-subtle)' }}>
    <div className="flex items-center justify-between mb-4">
      <div className="skeleton h-10 w-10 rounded-xl" />
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
    <div className="skeleton h-8 w-24 mb-2" />
    <div className="skeleton h-4 w-32" />
  </div>
)
