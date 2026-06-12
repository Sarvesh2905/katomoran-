import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, ExternalLink, BarChart3, Trash2, QrCode, Calendar, MousePointer, MoreVertical, Edit3, Power, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../UI/Badge.jsx'
import { QRModal } from './QRModal.jsx'
import { useToast } from '../UI/Toaster.jsx'
import { getShortUrl } from '../../utils/shortUrl.js'
import { formatDistanceToNow } from 'date-fns'

export const LinkCard = ({ link, onDelete, onEdit, onToggleStatus }) => {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const shortUrl = getShortUrl(link)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      addToast('Short URL copied!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast('Failed to copy', 'error')
    }
  }

  const handleToggle = () => {
    onToggleStatus?.(link._id, link.status === 'disabled' ? 'active' : 'disabled')
    setShowMenu(false)
  }

  const statusVariant = { active: 'success', expired: 'warning', disabled: 'danger' }
  const healthColorMap = {
    emerald: 'text-emerald-400',
    blue:    'text-violet-400',
    amber:   'text-amber-400',
    rose:    'text-rose-400'
  }

  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
  }, [])

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="glass-card rounded-2xl p-5 group relative overflow-hidden shimmer-overlay"
        style={{
          border: '1px solid var(--border-subtle)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.4s ease',
          willChange: 'transform'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient accent top line - only for active links */}
        {link.status === 'active' && (
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)' }} />
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 mr-3">
            {/* Title + status */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate max-w-[220px]" style={{ color: 'var(--text-primary)' }}>
                {link.title || link.originalUrl}
              </h3>
              <Badge variant={statusVariant[link.status] || 'default'}>{link.status}</Badge>
            </div>

            {/* Short URL + copy */}
            <div className="flex items-center gap-2 mb-3">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors truncate"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 p-1 rounded-md transition-all"
                style={{
                  color: copied ? '#34d399' : 'var(--text-muted)',
                  background: copied ? 'rgba(16,185,129,0.1)' : 'transparent'
                }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Original URL */}
            <p className="text-xs truncate mb-3" style={{ color: 'var(--text-muted)' }}>
              → {link.originalUrl}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-violet-400">
                <MousePointer className="h-3 w-3" />
                {(link.clickCount || 0).toLocaleString()} clicks
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
              </span>
              {link.health && (
                <span className={`text-xs font-medium ${healthColorMap[link.health.color] || 'text-slate-400'}`}>
                  ⚡ {link.health.label} ({link.health.score})
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => navigate(`/links/${link._id}`)}
              className="p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              style={{ color: 'var(--text-muted)', background: 'rgba(139,92,246,0.08)' }}
              title="Analytics"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              style={{ color: 'var(--text-muted)', background: 'rgba(6,182,212,0.08)' }}
              title="QR Code"
            >
              <QrCode className="h-4 w-4" />
            </button>

            {/* 3-dot menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-xl transition-all"
                style={{
                  color: 'var(--text-muted)',
                  background: showMenu ? 'rgba(139,92,246,0.1)' : 'transparent'
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="cosmic-dropdown absolute right-0 mt-1 w-48 rounded-xl py-1 z-20"
                    >
                      <button onClick={() => { navigate(`/links/${link._id}`); setShowMenu(false) }}
                        className="cosmic-dropdown-item w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5">
                        <BarChart3 className="h-3.5 w-3.5 text-violet-400" /> Analytics
                      </button>
                      <button onClick={() => { onEdit?.(link); setShowMenu(false) }}
                        className="cosmic-dropdown-item w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5">
                        <Edit3 className="h-3.5 w-3.5 text-cyan-400" /> Edit
                      </button>
                      <button onClick={handleCopy}
                        className="cosmic-dropdown-item w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5">
                        <Copy className="h-3.5 w-3.5 text-slate-400" /> Copy Link
                      </button>
                      <button onClick={() => { window.open(link.originalUrl, '_blank'); setShowMenu(false) }}
                        className="cosmic-dropdown-item w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5">
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" /> Open Original
                      </button>
                      {link.status !== 'expired' && (
                        <button onClick={handleToggle}
                          className="cosmic-dropdown-item w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5">
                          <Power className="h-3.5 w-3.5 text-amber-400" />
                          {link.status === 'disabled' ? 'Enable Link' : 'Disable Link'}
                        </button>
                      )}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
                      <button onClick={() => { onDelete(link._id); setShowMenu(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <QRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        qrCode={link.qrCode}
        shortUrl={shortUrl}
      />
    </>
  )
}