export const LoadingSpinner = ({ size = 'md', text }) => {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full`}
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(139,92,246,1) 100%)',
            animation: 'spin 1s linear infinite'
          }}
        />
        <div className="absolute inset-0.5 rounded-full"
          style={{ background: 'var(--bg-surface)' }} />
      </div>
      {text && (
        <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>{text}</p>
      )}
    </div>
  )
}