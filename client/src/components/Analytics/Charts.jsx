import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COSMIC_COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#a78bfa', '#22d3ee']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card-static rounded-xl px-4 py-2.5"
      style={{ border: '1px solid var(--border-default)' }}>
      <p className="text-xs font-bold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{payload[0].value} clicks</p>
    </div>
  )
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CosmicPieChart = ({ data, title, emptyMsg = 'No data yet' }) => {
  if (!data?.length) {
    return (
      <div className="h-48 flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{emptyMsg}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              outerRadius={80}
              innerRadius={40}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COSMIC_COLORS[i % COSMIC_COLORS.length]}
                  stroke="transparent"
                  style={{ filter: `drop-shadow(0 0 6px ${COSMIC_COLORS[i % COSMIC_COLORS.length]}60)` }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-3 space-y-1.5">
        {data.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ background: COSMIC_COLORS[i % COSMIC_COLORS.length] }} />
              <span className="text-xs truncate capitalize" style={{ color: 'var(--text-secondary)' }}>
                {item.name}
              </span>
            </div>
            <span className="text-xs font-medium ml-2 flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const DeviceChart = ({ data }) => <CosmicPieChart data={data} title="Devices" />
export const BrowserChart = ({ data }) => <CosmicPieChart data={data} title="Browsers" />
export const ReferrerChart = ({ data }) => <CosmicPieChart data={data} title="Referrers" emptyMsg="No referrer data" />
