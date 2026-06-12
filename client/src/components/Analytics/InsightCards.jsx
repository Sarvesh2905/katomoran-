import { TrendingUp, TrendingDown, Smartphone, Globe, MapPin, Flame, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'

const iconMap = {
  'trending-up':   { Icon: TrendingUp,   color: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
  'trending-down': { Icon: TrendingDown, color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
  'smartphone':    { Icon: Smartphone,   color: '#22d3ee', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)' },
  'globe':         { Icon: Globe,        color: '#a78bfa', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)' },
  'map-pin':       { Icon: MapPin,       color: '#f472b6', bg: 'rgba(236,72,153,0.1)',  border: 'rgba(236,72,153,0.25)' },
  'flame':         { Icon: Flame,        color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  'lightbulb':     { Icon: Lightbulb,    color: '#67e8f9', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)' }
}

export const InsightCards = ({ insights = [] }) => {
  if (!insights?.length) return null

  return (
    <div className="grid gap-3">
      {insights.map((insight, i) => {
        const { Icon, color, bg, border } = iconMap[insight.icon] || iconMap['globe']
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {insight.message}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}