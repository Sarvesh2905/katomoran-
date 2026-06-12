import { useState } from 'react'
import { Modal } from '../UI/Modal.jsx'
import { Input } from '../UI/Input.jsx'
import { Button } from '../UI/Button.jsx'
import { Link2, Tag, AlignLeft, Calendar, Save } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateLink } from '../../api/links.js'
import { useToast } from '../UI/Toaster.jsx'

export const EditLinkModal = ({ isOpen, onClose, link }) => {
  const { addToast } = useToast()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    originalUrl: link?.originalUrl || '',
    title: link?.title || '',
    customAlias: link?.customAlias || '',
    expiryDate: link?.expiryDate ? new Date(link.expiryDate).toISOString().split('T')[0] : ''
  })

  const mutation = useMutation({
    mutationFn: (data) => updateLink(link._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['links'])
      addToast('Link updated successfully!', 'success')
      onClose()
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to update link', 'error')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      originalUrl: form.originalUrl,
      title: form.title,
      customAlias: form.customAlias || undefined,
      expiryDate: form.expiryDate || null
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Link">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Destination URL"
          icon={Link2}
          value={form.originalUrl}
          onChange={e => setForm(f => ({ ...f, originalUrl: e.target.value }))}
          placeholder="https://example.com"
          required
          type="url"
        />
        <Input
          label="Link Title"
          icon={AlignLeft}
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Optional title"
        />
        <Input
          label="Custom Alias"
          icon={Tag}
          value={form.customAlias}
          onChange={e => setForm(f => ({ ...f, customAlias: e.target.value }))}
          placeholder="my-custom-alias"
          hint="Leave blank to keep current alias"
        />
        <Input
          label="Expiry Date"
          icon={Calendar}
          type="date"
          value={form.expiryDate}
          onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
          hint="Leave blank for no expiry"
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={mutation.isPending}>
            <Save className="h-4 w-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
