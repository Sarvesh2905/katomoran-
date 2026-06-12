import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...args) => twMerge(clsx(args))

export const Input = forwardRef(({ label, error, icon: Icon, hint, className, ...props }, ref) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'cosmic-input block w-full rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
            Icon && 'pl-10',
            error && '!border-rose-500 focus:!border-rose-500 !shadow-rose-500/20'
          )}
          {...props}
        />
      </div>
      {hint && !error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'