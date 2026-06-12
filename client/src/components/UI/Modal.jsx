import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative glass-card-static rounded-2xl w-full ${widths[maxWidth]} overflow-hidden`}
            style={{ border: '1px solid var(--border-default)' }}
          >
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 aurora-gradient" />

            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 className="text-base font-semibold gradient-text-violet">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-all hover:bg-white/5"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}