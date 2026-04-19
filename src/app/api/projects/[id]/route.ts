import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { updateProjectSchema } from '@/lib/validations'
import { parseJSON, stringifyJSON } from '@/lib/utils'

/**
 * GET /api/projects/[id]
 * Fetches a single project by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
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

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...project,
      techStack: parseJSON(project.techStack, []),
    })
  } catch (error) {
    console.error(`GET /api/projects/${params.id} error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/projects/[id]
 * Updates a project. All fields are optional.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validate partial update
    const validatedData = updateProjectSchema.parse(body)

    // Check if project exists
    const existingProject = await db.project.findUnique({
      where: { id: params.id },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const project = await db.project.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        description: validatedData.description ?? existingProject.description,
        techStack: validatedData.techStack
          ? stringifyJSON(validatedData.techStack)
          : undefined,
        status: validatedData.status,
        liveUrl: validatedData.liveUrl ?? existingProject.liveUrl,
        repoUrl: validatedData.repoUrl ?? existingProject.repoUrl,
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

    return NextResponse.json({
      ...project,
      techStack: parseJSON(project.techStack, []),
    })
  } catch (error: any) {
    console.error(`PUT /api/projects/${params.id} error:`, error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/projects/[id]
 * Deletes a project by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await db.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(`DELETE /api/projects/${params.id} error:`, error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
