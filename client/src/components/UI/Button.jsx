import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...args) => twMerge(clsx(args))

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary:   'btn-cosmic',
    secondary: 'bg-white/5 text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-white/10 hover:border-[var(--border-glow)]',
    danger:    'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-500 hover:to-rose-400 shadow-lg shadow-rose-500/20',
    ghost:     'btn-ghost-cosmic',
    outline:   'border-2 border-violet-500 text-violet-400 hover:bg-violet-500/10',
    cyan:      'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2.5 text-sm gap-1.5',
    lg: 'px-6 py-3 text-base gap-2'
  }

  return (
    <button
      className={cn(base, variants[variant] || variants.primary, sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
}