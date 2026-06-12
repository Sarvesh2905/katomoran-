import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...args) => twMerge(clsx(args))

export const Card = ({ children, className, hover = false, glow = false, gradient = false }) => (
  <div className={cn(
    gradient ? 'gradient-border rounded-2xl' : 'glass-card rounded-2xl',
    hover && 'cursor-pointer',
    glow && 'animate-glow-pulse',
    className
  )}>
    {children}
  </div>
)

export const CardHeader = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-b', className)}
    style={{ borderColor: 'var(--border-subtle)' }}>
    {children}
  </div>
)

export const CardContent = ({ children, className }) => (
  <div className={cn('px-6 py-4', className)}>
    {children}
  </div>
)