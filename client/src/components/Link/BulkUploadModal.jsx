import { useState, useRef } from 'react'
import { Modal } from '../UI/Modal.jsx'
import { Button } from '../UI/Button.jsx'
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, DownloadCloud } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bulkCreate } from '../../api/links.js'
import { useToast } from '../UI/Toaster.jsx'

export const BulkUploadModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const mutation = useMutation({
    mutationFn: (formData) => bulkCreate(formData),
    onSuccess: (res) => {
      setResult(res.data)
      queryClient.invalidateQueries(['links'])
      addToast(`Created ${res.data.created} links successfully!`, 'success')
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Upload failed', 'error')
    }
  })

  const handleFile = (f) => {
    if (!f) return
    if (!f.name.endsWith('.csv')) {
      addToast('Please upload a CSV file', 'error')
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    mutation.mutate(formData)
  }

  const handleClose = () => {
    setFile(null)
    setResult(null)
    onClose()
  }

  const downloadTemplate = () => {
    const csv = 'originalUrl,customAlias,title,expiryDate\nhttps://example.com,my-link,Example Link,2026-12-31\nhttps://google.com,,Google,\n'
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'katomaran-bulk-template.csv'
    a.click()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Links" maxWidth="md">
      <div className="space-y-5">
        {/* Template download */}
        <button onClick={downloadTemplate}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all"
          style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#22d3ee' }}>
          <DownloadCloud className="h-4 w-4 flex-shrink-0" />
          <span>Download CSV Template</span>
        </button>

        {/* CSV format hint */}
        <div className="rounded-xl px-4 py-3 text-xs space-y-1"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: 'var(--text-secondary)' }}>
          <p className="font-medium text-violet-400">Required columns:</p>
          <p><span className="text-violet-300">originalUrl</span> (required) · <span className="text-slate-400">customAlias, title, expiryDate</span> (optional)</p>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer transition-all"
          style={{
            border: `2px dashed ${isDragOver ? 'rgba(139,92,246,0.7)' : file ? 'rgba(16,185,129,0.5)' : 'var(--border-default)'}`,
            background: isDragOver ? 'rgba(139,92,246,0.05)' : 'transparent'
          }}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden"
            onChange={e => handleFile(e.target.files[0])} />
          {file ? (
            <>
              <FileText className="h-8 w-8 mb-2 text-emerald-400" />
              <p className="text-sm font-medium text-emerald-400">{file.name}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 mb-2 text-violet-400" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Drop CSV here or click to browse
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Max 5MB</p>
            </>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{result.created} links created</span>
            </div>
            {result.errors?.length > 0 && (
              <div className="rounded-xl p-3"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="flex items-center gap-2 mb-2 text-rose-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-medium">{result.errors.length} errors</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="text-rose-400">·</span> {e.row?.originalUrl || 'Row'}: {e.error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleClose} className="flex-1">
            {result ? 'Close' : 'Cancel'}
          </Button>
          {!result && (
            <Button onClick={handleSubmit} disabled={!file} isLoading={mutation.isPending} className="flex-1">
              <Upload className="h-4 w-4 mr-1.5" />
              Upload & Create
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
