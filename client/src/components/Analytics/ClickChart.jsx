import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card-static rounded-xl px-4 py-2.5"
      style={{ border: '1px solid var(--border-default)' }}>
      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-sm font-bold text-violet-400">{payload[0].value.toLocaleString()} clicks</p>
    </div>
  )
}

export const ClickChart = ({ data, onRangeChange }) => {
  const [range, setRange] = useState(7)

  const handleRange = (days) => {
    setRange(days)
    onRangeChange?.(days)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 justify-end">
        {[7, 30, 90].map(d => (
          <button
            key={d}
            onClick={() => handleRange(d)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              background: range === d ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: range === d ? '#a78bfa' : 'var(--text-muted)',
              border: range === d ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border-subtle)'
            }}
          >
            {d}d
          </button>
        ))}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b' }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.3)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="url(#clickGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: '#8b5cf6',
                stroke: 'rgba(139,92,246,0.4)',
                strokeWidth: 4,
                style: { filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.6))' }
              }}
              animationDuration={1200}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}