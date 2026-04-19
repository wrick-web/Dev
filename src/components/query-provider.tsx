'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Provider component for React Query (TanStack Query).
 * Manages server state and caching for API calls.
 * Must wrap the application for queries to work.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
