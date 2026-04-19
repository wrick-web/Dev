'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useResources } from '@/lib/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResourceCard } from '@/components/resource-card'
import { Plus } from 'lucide-react'

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
 * Resources page displaying all learning resources.
 * Supports filtering by category and read status.
 */
export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const resourcesQuery = useResources(
    selectedCategory,
    showUnreadOnly ? false : undefined
  )

  if (resourcesQuery.isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Resources</h1>
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

  const resources = resourcesQuery.data?.resources || []

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resources</h1>
        <Link href="/resources/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Resource
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === undefined ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(undefined)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Button
          variant={showUnreadOnly ? 'default' : 'outline'}
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
        >
          {showUnreadOnly ? '✓ Unread Only' : 'Show All'}
        </Button>
      </div>

      {resources.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No resources found. Start collecting!</p>
          <Link href="/resources/new">
            <Button>Add Your First Resource</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource: any) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  )
}
