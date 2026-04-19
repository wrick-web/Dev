'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Trash2, Star } from 'lucide-react'
import type { ResourceResponse } from '@/lib/validations'

interface ResourceCardProps {
  resource: ResourceResponse
  onDelete?: (id: string) => void
  onToggleFavorite?: (id: string, isFavorite: boolean) => void
}

const categoryIcons: Record<string, string> = {
  DOCUMENTATION: '📖',
  TUTORIAL: '🎓',
  ARTICLE: '📰',
  VIDEO: '🎥',
  TOOL: '🛠️',
  LIBRARY: '📦',
  OTHER: '📌',
}

/**
 * Card component for displaying a resource.
 * Shows title, category, read status, and favorite toggle.
 */
export function ResourceCard({
  resource,
  onDelete,
  onToggleFavorite,
}: ResourceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-1">
              <span>{categoryIcons[resource.category]}</span>
              <CardTitle className="text-sm line-clamp-2">{resource.title}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              {resource.category}
            </Badge>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(resource.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {resource.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">{resource.notes}</p>
        )}

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleFavorite(resource.id, !resource.isFavorite)}
              className={resource.isFavorite ? 'text-yellow-500' : ''}
            >
              <Star className={`h-4 w-4 ${resource.isFavorite ? 'fill-yellow-500' : ''}`} />
            </Button>
          )}

          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </a>
        </div>

        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{resource.isRead ? '✓ Read' : 'Unread'}</span>
          <span>
            {new Date(resource.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
