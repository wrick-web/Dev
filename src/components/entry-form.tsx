'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEntrySchema, type CreateEntryInput } from '@/lib/validations'
import { useCreateEntry, useUpdateEntry } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { X } from 'lucide-react'

interface EntryFormProps {
  initialData?: {
    id: string
    title: string
    body: string
    tags: string[]
    projectId?: string | null
  }
}

/**
 * Form component for creating and editing entries.
 * Uses react-hook-form with Zod validation.
 */
export function EntryForm({ initialData }: EntryFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')

  const createEntryMutation = useCreateEntry()
  const updateEntryMutation = initialData?.id ? useUpdateEntry(initialData.id) : null

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateEntryInput>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: initialData || {
      title: '',
      body: '',
      tags: [],
      projectId: null,
    },
  })

  const onSubmit = async (data: CreateEntryInput) => {
    const submitData = { ...data, tags }

    try {
      if (initialData?.id) {
        await updateEntryMutation?.mutateAsync(submitData)
        toast.success('Entry updated successfully')
      } else {
        await createEntryMutation.mutateAsync(submitData)
        toast.success('Entry created successfully')
      }
      router.push('/entries')
    } catch (error) {
      toast.error('Failed to save entry')
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Entry' : 'New Entry'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What did you learn today?"
              {...register('title')}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Entry (Markdown supported)</Label>
            <Textarea
              id="body"
              placeholder="Write your learning journal entry here..."
              rows={10}
              {...register('body')}
              disabled={isSubmitting}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                placeholder="Add a tag (e.g., React, TypeScript)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={isSubmitting}
                variant="outline"
              >
                Add
              </Button>
            </div>

            {/* Tag chips */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {initialData ? 'Update Entry' : 'Create Entry'}
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
