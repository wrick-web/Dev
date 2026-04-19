'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useEntries, useDeleteEntry } from '@/lib/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EntryCard } from '@/components/entry-card'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Entries page showing all learning journal entries.
 * Displays entries in a grid with pagination support.
 */
export default function EntriesPage() {
  const [skip, setSkip] = useState(0)
  const take = 12

  const entriesQuery = useEntries(skip, take)

  const handleDeleteEntry = (id: string) => {
    const deleteEntryMutation = useDeleteEntry(id)
    deleteEntryMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Entry deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete entry')
      },
    })
  }

  if (entriesQuery.isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Entries</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  const entries = entriesQuery.data?.entries || []
  const total = entriesQuery.data?.total || 0

  const hasNextPage = skip + take < total
  const hasPrevPage = skip > 0

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Entries</h1>
        <Link href="/entries/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </Link>
      </div>

      {entries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No entries yet. Start your learning journey!</p>
          <Link href="/entries/new">
            <Button>Create Your First Entry</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry: any) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing {skip + 1}-{Math.min(skip + take, total)} of {total} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSkip(Math.max(0, skip - take))}
                disabled={!hasPrevPage}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setSkip(skip + take)}
                disabled={!hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
