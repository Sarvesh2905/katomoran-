export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default:  { className: 'bg-white/5 border border-white/10 text-slate-300' },
    success:  { className: 'badge-active' },
    warning:  { className: 'badge-expired' },
    danger:   { className: 'badge-disabled' },
    violet:   { className: 'bg-violet-500/15 border border-violet-500/30 text-violet-300' },
    cyan:     { className: 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' },
    pink:     { className: 'bg-pink-500/15 border border-pink-500/30 text-pink-300' }
  }

  const { className } = variants[variant] || variants.default

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${className}`}>
      {children}
    </span>
  )
}