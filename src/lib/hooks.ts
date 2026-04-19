'use client'

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  EntryResponse,
  ProjectResponse,
  ResourceResponse,
  CreateEntryInput,
  CreateProjectInput,
  CreateResourceInput,
  UpdateEntryInput,
  UpdateProjectInput,
  UpdateResourceInput,
} from '@/lib/validations'

/**
 * React Query hooks for entries.
 * Manages server state for entry CRUD operations.
 */

export function useEntries(skip = 0, take = 20) {
  return useQuery({
    queryKey: ['entries', skip, take],
    queryFn: async () => {
      const res = await fetch(`/api/entries?skip=${skip}&take=${take}`)
      if (!res.ok) throw new Error('Failed to fetch entries')
      return res.json()
    },
  })
}

export function useEntry(id: string) {
  return useQuery({
    queryKey: ['entry', id],
    queryFn: async () => {
      const res = await fetch(`/api/entries/${id}`)
      if (!res.ok) throw new Error('Failed to fetch entry')
      return res.json() as Promise<EntryResponse>
    },
    enabled: !!id,
  })
}

export function useCreateEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateEntryInput) => {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create entry')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

export function useUpdateEntry(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateEntryInput) => {
      const res = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update entry')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['entry', id] })
    },
  })
}

export function useDeleteEntry(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete entry')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

/**
 * React Query hooks for projects.
 */

export function useProjects(status?: string) {
  return useQuery({
    queryKey: ['projects', status],
    queryFn: async () => {
      const url = status ? `/api/projects?status=${status}` : '/api/projects'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create project')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProjectInput) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update project')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

/**
 * React Query hooks for resources.
 */

export function useResources(category?: string, isRead?: boolean, skip = 0, take = 20) {
  let url = `/api/resources?skip=${skip}&take=${take}`
  if (category) url += `&category=${category}`
  if (isRead !== undefined) url += `&isRead=${isRead}`

  return useQuery({
    queryKey: ['resources', category, isRead, skip, take],
    queryFn: async () => {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch resources')
      return res.json()
    },
  })
}

export function useCreateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateResourceInput) => {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create resource')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}

export function useUpdateResourceToggle(ids: string[]) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { isRead?: boolean; isFavorite?: boolean }) => {
      const res = await fetch('/api/resources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, ...data }),
      })
      if (!res.ok) throw new Error('Failed to update resources')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}
