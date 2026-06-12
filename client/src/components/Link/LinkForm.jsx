import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link2, Calendar, Tag, Wand2, Plus } from 'lucide-react'
import { Button } from '../UI/Button.jsx'
import { Input } from '../UI/Input.jsx'
import { Modal } from '../UI/Modal.jsx'
import { useToast } from '../UI/Toaster.jsx'
import { createLink } from '../../api/links.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  customAlias: z.string().min(3, 'Minimum 3 characters').max(30, 'Maximum 30 characters').regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, hyphens and underscores').optional().or(z.literal('')),
  title: z.string().max(100).optional(),
  expiryDate: z.string().optional()
})

export const LinkForm = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast()
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  })

  const mutation = useMutation({
    mutationFn: createLink,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['links'])
      queryClient.invalidateQueries(['global-analytics'])
      addToast('Link created successfully!', 'success')
      reset()
      onSuccess?.(res.data.link)
      onClose()
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to create link', 'error')
    }
  })

  const onSubmit = (data) => {
    const payload = { ...data }
    if (!payload.customAlias) delete payload.customAlias
    if (!payload.expiryDate) delete payload.expiryDate
    mutation.mutate(payload)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Link" maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Destination URL"
          icon={Link2}
          placeholder="https://your-long-url.com"
          error={errors.originalUrl?.message}
          {...register('originalUrl')}
        />
        <Input
          label="Custom Alias (optional)"
          icon={Tag}
          placeholder="my-brand-link"
          hint="3-30 chars: letters, numbers, hyphens, underscores"
          error={errors.customAlias?.message}
          {...register('customAlias')}
        />
        <Input
          label="Title (optional)"
          icon={Wand2}
          placeholder="Descriptive title for your link"
          {...register('title')}
        />
        <Input
          label="Expiry Date (optional)"
          icon={Calendar}
          type="datetime-local"
          hint="Leave blank for no expiry"
          {...register('expiryDate')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            <Plus className="h-4 w-4 mr-1" />
            Create Link
          </Button>
        </div>
      </form>
    </Modal>
  )
}