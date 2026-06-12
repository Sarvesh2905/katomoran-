import { Modal } from '../UI/Modal.jsx'
import { Button } from '../UI/Button.jsx'
import { Download, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../UI/Toaster.jsx'

export const QRModal = ({ isOpen, onClose, qrCode, shortUrl }) => {
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = qrCode
    a.download = `qrcode-${shortUrl?.split('/').pop()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    addToast('QR Code downloaded!', 'success')
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code" maxWidth="sm">
      <div className="flex flex-col items-center gap-5">
        {qrCode && (
          <div className="relative p-3 rounded-2xl"
            style={{
              background: 'white',
              boxShadow: '0 0 40px rgba(139,92,246,0.3)'
            }}>
            <img src={qrCode} alt="QR Code" className="w-56 h-56 rounded-xl" />
          </div>
        )}

        {/* Short URL with copy */}
        <div className="w-full flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span className="text-xs font-medium text-violet-400 flex-1 truncate">{shortUrl}</span>
          <button onClick={handleCopyUrl} className="p-1 rounded-md transition-all"
            style={{ color: copied ? '#34d399' : 'var(--text-muted)' }}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Scan this QR code to redirect to your destination URL
        </p>

        <Button onClick={handleDownload} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download PNG
        </Button>
      </div>
    </Modal>
  )
}