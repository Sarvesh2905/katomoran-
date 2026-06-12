import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp.js'

const GrowthBadge = ({ value, label }) => {
  if (value === undefined || value === null) return null

  const isPositive = value > 0
  const isNegative = value < 0
  const isNeutral = value === 0

  const color = isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-500'
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3" />
      <span>
        {isNeutral ? '—' : `${isPositive ? '+' : ''}${value}%`} {label}
      </span>
    </div>
  )
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = 'violet',
  weeklyGrowth,
  monthlyGrowth,
  delay = 0,
  prefix = '',
  suffix = '',
  isText = false
}) => {
  const cardRef = useRef(null)
  const numericValue = isText ? 0 : (typeof value === 'number' ? value : 0)
  const animated = useCountUp(numericValue, 1400)

  const iconColors = {
    violet: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', glow: 'rgba(139,92,246,0.3)' },
    cyan:   { bg: 'rgba(6,182,212,0.15)',  color: '#22d3ee', glow: 'rgba(6,182,212,0.3)' },
    pink:   { bg: 'rgba(236,72,153,0.15)', color: '#f472b6', glow: 'rgba(236,72,153,0.3)' },
    emerald:{ bg: 'rgba(16,185,129,0.15)', color: '#34d399', glow: 'rgba(16,185,129,0.3)' },
    amber:  { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', glow: 'rgba(245,158,11,0.3)' }
  }

  const ic = iconColors[iconColor] || iconColors.violet

  const displayValue = isText
    ? value
    : `${prefix}${animated.toLocaleString()}${suffix}`

  // ── 3D Tilt on mouse move ──
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card-3d rounded-2xl p-5 shimmer-overlay aurora-border-glow float-subtle"
      style={{
        border: '1px solid var(--border-subtle)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.4s ease',
        willChange: 'transform'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className="p-2.5 rounded-xl icon-glow"
            style={{ background: ic.bg, boxShadow: `0 0 20px ${ic.glow}` }}>
            <Icon className="h-5 w-5" style={{ color: ic.color }} />
          </div>
        )}
      </div>

      <div className="animate-count-in" style={{ transform: 'translateZ(20px)' }}>
        <p className="text-2xl font-bold mb-0.5 gradient-text-violet">
          {displayValue}
        </p>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      </div>

      {(weeklyGrowth !== undefined || monthlyGrowth !== undefined) && (
        <div className="space-y-1 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {weeklyGrowth !== undefined && (
            <GrowthBadge value={weeklyGrowth} label="this week" />
          )}
          {monthlyGrowth !== undefined && (
            <GrowthBadge value={monthlyGrowth} label="this month" />
          )}
        </div>
      )}
    </motion.div>
  )
}