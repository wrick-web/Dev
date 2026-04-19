'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Github, Trash2 } from 'lucide-react'
import type { ProjectResponse } from '@/lib/validations'

interface ProjectCardProps {
  project: ProjectResponse & { _count?: { entries: number; resources: number } }
  onDelete?: (id: string) => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  IDEA: { bg: 'bg-blue-100', text: 'text-blue-800' },
  BUILDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  SHIPPED: { bg: 'bg-green-100', text: 'text-green-800' },
  PAUSED: { bg: 'bg-gray-100', text: 'text-gray-800' },
}

/**
 * Card component for displaying a project.
 * Shows project status, tech stack, links, and stats.
 */
export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const colors = statusColors[project.status] || statusColors.IDEA

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <div className="mt-2">
              <Badge className={`${colors.bg} ${colors.text} border-0`}>
                {project.status}
              </Badge>
            </div>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(project.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 flex flex-col">
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Tech Stack</p>
            <div className="flex flex-wrap gap-1">
              {project.techStack.map((tech: string) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {project._count && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>📝 {project._count.entries} entries</p>
            <p>📚 {project._count.resources} resources</p>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-2 mt-auto pt-4">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-3 w-3 mr-2" />
                Live
              </Button>
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full">
                <Github className="h-3 w-3 mr-2" />
                Repo
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
