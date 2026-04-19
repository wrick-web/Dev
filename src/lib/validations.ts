import { z } from 'zod'

// Entry Validations
export const createEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  body: z.string().min(1, 'Entry body is required'),
  tags: z.array(z.string()).default([]),
  projectId: z.string().optional().nullable(),
})

export type CreateEntryInput = z.infer<typeof createEntrySchema>

export const updateEntrySchema = createEntrySchema.partial()

export type UpdateEntryInput = z.infer<typeof updateEntrySchema>

// Project Validations
export const projectStatusEnum = z.enum(['IDEA', 'BUILDING', 'SHIPPED', 'PAUSED'])

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().nullable(),
  techStack: z.array(z.string()).default([]),
  status: projectStatusEnum.default('IDEA'),
  liveUrl: z.string().url('Invalid URL').optional().nullable(),
  repoUrl: z.string().url('Invalid URL').optional().nullable(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>

export const updateProjectSchema = createProjectSchema.partial()

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

// Resource Validations
export const resourceCategoryEnum = z.enum([
  'DOCUMENTATION',
  'TUTORIAL',
  'ARTICLE',
  'VIDEO',
  'TOOL',
  'LIBRARY',
  'OTHER',
])

export const createResourceSchema = z.object({
  url: z.string().url('Invalid URL'),
  title: z.string().min(1, 'Title is required'),
  category: resourceCategoryEnum,
  notes: z.string().optional().nullable(),
  isRead: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  entryId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
})

export type CreateResourceInput = z.infer<typeof createResourceSchema>

export const updateResourceSchema = createResourceSchema.partial()

export type UpdateResourceInput = z.infer<typeof updateResourceSchema>

// Toggle schemas for PATCH operations
export const toggleResourceReadSchema = z.object({
  isRead: z.boolean(),
})

export const toggleResourceFavoriteSchema = z.object({
  isFavorite: z.boolean(),
})

// API Response schemas
export const entryResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  projectId: z.string().nullable(),
})

export type EntryResponse = z.infer<typeof entryResponseSchema>

export const projectResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  techStack: z.array(z.string()),
  status: projectStatusEnum,
  liveUrl: z.string().nullable(),
  repoUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ProjectResponse = z.infer<typeof projectResponseSchema>

export const resourceResponseSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  category: resourceCategoryEnum,
  notes: z.string().nullable(),
  isRead: z.boolean(),
  isFavorite: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  entryId: z.string().nullable(),
  projectId: z.string().nullable(),
})

export type ResourceResponse = z.infer<typeof resourceResponseSchema>
