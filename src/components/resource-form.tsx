'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createResourceSchema, type CreateResourceInput, resourceCategoryEnum } from '@/lib/validations'
import { useCreateResource } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const categories = [
  'DOCUMENTATION',
  'TUTORIAL',
  'ARTICLE',
  'VIDEO',
  'TOOL',
  'LIBRARY',
  'OTHER',
]

/**
 * Form component for creating resources.
 * Includes URL, title, category, and optional notes.
 */
export function ResourceForm() {
  const router = useRouter()

  const createResourceMutation = useCreateResource()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateResourceInput>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      url: '',
      title: '',
      category: 'ARTICLE',
      notes: '',
      isRead: false,
      isFavorite: false,
    },
  })

  const onSubmit = async (data: CreateResourceInput) => {
    try {
      await createResourceMutation.mutateAsync(data)
      toast.success('Resource added successfully')
      router.push('/resources')
    } catch (error) {
      toast.error('Failed to add resource')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Resource</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              {...register('url')}
              disabled={isSubmitting}
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Resource Title"
              {...register('title')}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              {...register('category')}
              disabled={isSubmitting}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add your notes about this resource..."
              rows={4}
              {...register('notes')}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              Add Resource
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
