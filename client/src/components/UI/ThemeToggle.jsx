import { useTheme } from '../../hooks/useTheme.js'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${className}`}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
          : 'rgba(255,255,255,0.2)',
        border: '1px solid var(--border-default)',
        boxShadow: isDark ? '0 0 12px rgba(124,58,237,0.4)' : 'none'
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ x: isDark ? -4 : 24, opacity: 0, scale: 0.6 }}
          animate={{ x: isDark ? 4 : 18, opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 flex items-center justify-center w-5 h-5 rounded-full"
          style={{ background: isDark ? 'rgba(255,255,255,0.95)' : '#7c3aed' }}
        >
          {isDark
            ? <Moon className="h-2.5 w-2.5 text-violet-700" />
            : <Sun className="h-2.5 w-2.5 text-white" />
          }
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
