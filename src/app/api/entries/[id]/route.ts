import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { updateEntrySchema } from '@/lib/validations'
import { parseJSON, stringifyJSON } from '@/lib/utils'

/**
 * GET /api/entries/[id]
 * Fetches a single entry by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const entry = await db.entry.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        body: true,
        tags: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
      },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...entry,
      tags: parseJSON(entry.tags, []),
    })
  } catch (error) {
    console.error(`GET /api/entries/${id} error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch entry' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/entries/[id]
 * Updates an entry. All fields are optional.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()

    // Validate partial update
    const validatedData = updateEntrySchema.parse(body)

    // Check if entry exists
    const existingEntry = await db.entry.findUnique({
      where: { id },
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    const entry = await db.entry.update({
      where: { id },
      data: {
        title: validatedData.title,
        body: validatedData.body,
        tags: validatedData.tags ? stringifyJSON(validatedData.tags) : undefined,
        projectId: validatedData.projectId ?? existingEntry.projectId,
      },
      select: {
        id: true,
        title: true,
        body: true,
        tags: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
      },
    })

    return NextResponse.json({
      ...entry,
      tags: parseJSON(entry.tags, []),
    })
  } catch (error: any) {
    console.error(`PUT /api/entries/${id} error:`, error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/entries/[id]
 * Deletes an entry by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const entry = await db.entry.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    await db.entry.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Entry deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(`DELETE /api/entries/${id} error:`, error)
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}
