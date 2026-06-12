export const GeoTable = ({ data = [] }) => {
  if (!data.length) return (
    <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No geographic data yet</p>
  )

  const total = data.reduce((s, d) => s + d.value, 0)
  const max = Math.max(...data.map(d => d.value))

  const flagEmoji = (country) => {
    const flags = {
      'United States': '🇺🇸', 'India': '🇮🇳', 'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Germany': '🇩🇪',
      'France': '🇫🇷', 'Japan': '🇯🇵', 'Brazil': '🇧🇷',
      'China': '🇨🇳', 'Russia': '🇷🇺', 'Mexico': '🇲🇽',
      'South Korea': '🇰🇷', 'Indonesia': '🇮🇩', 'Netherlands': '🇳🇱',
      'Singapore': '🇸🇬', 'Unknown': '🌍'
    }
    return flags[country] || '🌐'
  }

  return (
    <div className="space-y-2.5">
      {data.map((country, i) => {
        const pct = total > 0 ? Math.round((country.value / total) * 100) : 0
        const barPct = max > 0 ? (country.value / max) * 100 : 0

        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">{flagEmoji(country.name)}</span>
                <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {country.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-xs font-bold text-violet-400">{country.value}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
              </div>
            </div>
            <div className="h-1 w-full rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${barPct}%`,
                  background: `linear-gradient(90deg, #8b5cf6, #06b6d4)`,
                  boxShadow: '0 0 8px rgba(139,92,246,0.5)'
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}