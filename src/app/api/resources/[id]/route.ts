import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { updateResourceSchema } from '@/lib/validations'

/**
 * GET /api/resources/[id]
 * Fetches a single resource by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await db.resource.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        url: true,
        title: true,
        category: true,
        notes: true,
        isRead: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        entryId: true,
        projectId: true,
      },
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error(`GET /api/resources/${params.id} error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/resources/[id]
 * Updates a resource. All fields are optional.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validate partial update
    const validatedData = updateResourceSchema.parse(body)

    // Check if resource exists
    const existingResource = await db.resource.findUnique({
      where: { id: params.id },
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    const resource = await db.resource.update({
      where: { id: params.id },
      data: {
        url: validatedData.url,
        title: validatedData.title,
        category: validatedData.category,
        notes: validatedData.notes ?? existingResource.notes,
        isRead: validatedData.isRead ?? existingResource.isRead,
        isFavorite: validatedData.isFavorite ?? existingResource.isFavorite,
        entryId: validatedData.entryId ?? existingResource.entryId,
        projectId: validatedData.projectId ?? existingResource.projectId,
      },
      select: {
        id: true,
        url: true,
        title: true,
        category: true,
        notes: true,
        isRead: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        entryId: true,
        projectId: true,
      },
    })

    return NextResponse.json(resource)
  } catch (error: any) {
    console.error(`PUT /api/resources/${params.id} error:`, error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/resources/[id]
 * Deletes a resource by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await db.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    await db.resource.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: 'Resource deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(`DELETE /api/resources/${params.id} error:`, error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}
