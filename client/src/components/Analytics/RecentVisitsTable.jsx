import { format } from 'date-fns'
import { Monitor, Smartphone, Globe, MapPin, Clock } from 'lucide-react'

export const RecentVisitsTable = ({ visits = [] }) => {
  if (!visits?.length) return (
    <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No visits recorded yet</p>
  )

  const deviceIcon = (device) => {
    if (device === 'mobile') return <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
    return <Monitor className="h-3.5 w-3.5 text-violet-400" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {['Time', 'Device', 'Browser', 'Country', 'Referrer'].map(h => (
              <th key={h} className="text-left pb-2 pr-4 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visits.map((visit, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors"
              style={{ borderBottom: '1px solid var(--border-subtle)', opacity: 1 }}>
              <td className="py-2.5 pr-4 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(visit.timestamp), 'MMM dd HH:mm')}
                </div>
              </td>
              <td className="py-2.5 pr-4">
                <div className="flex items-center gap-1">
                  {deviceIcon(visit.device)}
                  <span className="capitalize" style={{ color: 'var(--text-secondary)' }}>{visit.device}</span>
                </div>
              </td>
              <td className="py-2.5 pr-4" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3 text-violet-400" />
                  {visit.browser}
                </div>
              </td>
              <td className="py-2.5 pr-4" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-pink-400" />
                  {visit.city && visit.city !== 'Unknown' ? `${visit.city}, ` : ''}{visit.country}
                </div>
              </td>
              <td className="py-2.5" style={{ color: 'var(--text-muted)', maxWidth: '140px' }}>
                <span className="truncate block">
                  {visit.referrer === 'Direct' || !visit.referrer ? 'Direct' : visit.referrer}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
