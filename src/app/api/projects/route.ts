import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createProjectSchema } from '@/lib/validations'
import { parseJSON, stringifyJSON } from '@/lib/utils'
import { ProjectStatus } from '@prisma/client'

/**
 * GET /api/projects
 * Fetches all projects with optional filtering by status.
 * Returns all projects sorted by creation date.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')

    // Validate status parameter against enum values
    let status: ProjectStatus | undefined
    if (statusParam) {
      const validStatuses = Object.values(ProjectStatus)
      if (!validStatuses.includes(statusParam as ProjectStatus)) {
        return NextResponse.json(
          { error: 'Invalid status parameter. Must be one of: IDEA, BUILDING, SHIPPED, PAUSED' },
          { status: 400 }
        )
      }
      status = statusParam as ProjectStatus
    }

    const projects = await db.project.findMany({
      where: status ? { status: status as ProjectStatus } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        techStack: true,
        status: true,
        liveUrl: true,
        repoUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { entries: true, resources: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Parse techStack from JSON strings
    const parsedProjects = projects.map((project) => ({
      ...project,
      techStack: parseJSON(project.techStack, []),
    }))

    return NextResponse.json({ projects: parsedProjects }, { status: 200 })
  } catch (error) {
    console.error('GET /api/projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/projects
 * Creates a new project with validation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validatedData = createProjectSchema.parse(body)

    const project = await db.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        techStack: stringifyJSON(validatedData.techStack),
        status: validatedData.status,
        liveUrl: validatedData.liveUrl || null,
        repoUrl: validatedData.repoUrl || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        techStack: true,
        status: true,
        liveUrl: true,
        repoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(
      {
        ...project,
        techStack: parseJSON(project.techStack, []),
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('POST /api/projects error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Project name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
