import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createResourceSchema } from '@/lib/validations'
import { ResourceCategory } from '@prisma/client'

/**
 * GET /api/resources
 * Fetches all resources with optional filtering by category, isRead, or isFavorite.
 * Supports pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')
    const isRead = searchParams.get('isRead')
    const isFavorite = searchParams.get('isFavorite')
    const skip = parseInt(searchParams.get('skip') ?? '0')
    const take = parseInt(searchParams.get('take') ?? '20')

    // Validate category parameter against enum values
    let category: ResourceCategory | undefined
    if (categoryParam) {
      const validCategories = Object.values(ResourceCategory)
      if (!validCategories.includes(categoryParam as ResourceCategory)) {
        return NextResponse.json(
          { error: 'Invalid category parameter. Must be one of: DOCUMENTATION, TUTORIAL, ARTICLE, VIDEO, TOOL, LIBRARY, OTHER' },
          { status: 400 }
        )
      }
      category = categoryParam as ResourceCategory
    }

    const where: any = {}
    if (category) where.category = category
    if (isRead !== null) where.isRead = isRead === 'true'
    if (isFavorite !== null) where.isFavorite = isFavorite === 'true'

    const [resources, total] = await Promise.all([
      db.resource.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      db.resource.count({ where }),
    ])

    return NextResponse.json(
      { resources, total, skip, take },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET /api/resources error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/resources
 * Creates a new resource with validation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validatedData = createResourceSchema.parse(body)

    const resource = await db.resource.create({
      data: {
        url: validatedData.url,
        title: validatedData.title,
        category: validatedData.category,
        notes: validatedData.notes || null,
        isRead: validatedData.isRead,
        isFavorite: validatedData.isFavorite,
        entryId: validatedData.entryId || null,
        projectId: validatedData.projectId || null,
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

    return NextResponse.json(resource, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/resources error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/resources
 * Bulk update resources. Supports toggling read status or favorite status.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, isRead, isFavorite } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (isRead === undefined && isFavorite === undefined) {
      return NextResponse.json(
        { error: 'Either isRead or isFavorite must be provided' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (isRead !== undefined) updateData.isRead = isRead
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite

    const resources = await db.resource.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    })

    return NextResponse.json(
      {
        message: `Updated ${resources.count} resource(s)`,
        count: resources.count,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PATCH /api/resources error:', error)
    return NextResponse.json(
      { error: 'Failed to update resources' },
      { status: 500 }
    )
  }
}
