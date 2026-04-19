'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProjectSchema, type CreateProjectInput, projectStatusEnum } from '@/lib/validations'
import { useCreateProject } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { X } from 'lucide-react'

/**
 * Form component for creating projects.
 * Includes status selector, tech stack input, and URLs.
 */
export function ProjectForm() {
  const router = useRouter()
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')

  const createProjectMutation = useCreateProject()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      techStack: [],
      status: 'IDEA',
      liveUrl: '',
      repoUrl: '',
    },
  })

  const onSubmit = async (data: CreateProjectInput) => {
    const submitData = { ...data, techStack }

    try {
      await createProjectMutation.mutateAsync(submitData)
      toast.success('Project created successfully')
      router.push('/projects')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create project')
    }
  }

  const addTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()])
      setTechInput('')
    }
  }

  const removeTech = (techToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== techToRemove))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Project"
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What is this project about?"
              rows={4}
              {...register('description')}
              disabled={isSubmitting}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status')}
              disabled={isSubmitting}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              {['IDEA', 'BUILDING', 'SHIPPED', 'PAUSED'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <Label htmlFor="tech">Tech Stack</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tech"
                placeholder="e.g., React, TypeScript, Node.js"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTech()
                  }
                }}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addTech}
                disabled={isSubmitting}
                variant="outline"
              >
                Add
              </Button>
            </div>

            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                type="url"
                placeholder="https://example.com"
                {...register('liveUrl')}
                disabled={isSubmitting}
              />
              {errors.liveUrl && (
                <p className="text-sm text-destructive">{errors.liveUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="repoUrl">Repository URL</Label>
              <Input
                id="repoUrl"
                type="url"
                placeholder="https://github.com/user/repo"
                {...register('repoUrl')}
                disabled={isSubmitting}
              />
              {errors.repoUrl && (
                <p className="text-sm text-destructive">{errors.repoUrl.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              Create Project
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
