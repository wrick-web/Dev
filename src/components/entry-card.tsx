'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import type { EntryResponse } from '@/lib/validations'

interface EntryCardProps {
  entry: EntryResponse
  onDelete?: (id: string) => void
}

/**
 * Card component for displaying an entry preview.
 * Shows title, date, body excerpt, tags, and delete option.
 */
export function EntryCard({ entry, onDelete }: EntryCardProps) {
  const excerpt = entry.body.length > 150 ? entry.body.substring(0, 150) + '...' : entry.body
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{entry.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(entry.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <Link href={`/entries/${entry.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            Read More
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
