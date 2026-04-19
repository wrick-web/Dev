'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProjects } from '@/lib/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectCard } from '@/components/project-card'
import { Plus } from 'lucide-react'

/**
 * Projects page displaying all development projects.
 * Shows project cards with status, tech stack, and stats.
 */
export default function ProjectsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>()

  const projectsQuery = useProjects(selectedStatus)

  if (projectsQuery.isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projects</h1>
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

  const projects = projectsQuery.data?.projects || []

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedStatus === undefined ? 'default' : 'outline'}
          onClick={() => setSelectedStatus(undefined)}
        >
          All
        </Button>
        {['IDEA', 'BUILDING', 'SHIPPED', 'PAUSED'].map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No projects yet. Start building!</p>
          <Link href="/projects/new">
            <Button>Create Your First Project</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
