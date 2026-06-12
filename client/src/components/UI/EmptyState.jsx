import { motion } from 'framer-motion'

export const EmptyState = ({ title, description, action, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="relative mb-6">
        {/* Glow orb behind icon */}
        <div className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)' }} />
        <div className="relative glass-card rounded-2xl p-5 w-20 h-20 flex items-center justify-center"
          style={{ border: '1px solid var(--border-default)' }}>
          {Icon ? (
            <Icon className="h-8 w-8 text-violet-400" />
          ) : (
            <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm max-w-sm mb-8" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      {action}
    </motion.div>
  )
}