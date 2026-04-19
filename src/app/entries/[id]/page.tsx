'use client'

import { useEntry } from '@/lib/hooks'
import { EntryForm } from '@/components/entry-form'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * Entry detail page for viewing/editing a single entry.
 * Loads entry data and displays the form in edit mode.
 */
export default function EntryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const entryQuery = useEntry(params.id)

  if (entryQuery.isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!entryQuery.data) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Entry not found</p>
          <Link href="/entries">
            <Button>Back to Entries</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
      <Link href="/entries">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Entries
        </Button>
      </Link>
      <EntryForm initialData={entryQuery.data} />
    </div>
  )
}
