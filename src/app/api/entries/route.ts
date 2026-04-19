import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createEntrySchema } from '@/lib/validations'
import { parseJSON, stringifyJSON } from '@/lib/utils'

/**
 * GET /api/entries
 * Fetches all entries sorted by date (newest first).
 * Returns paginated results for better performance.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skip = parseInt(searchParams.get('skip') ?? '0')
    const take = parseInt(searchParams.get('take') ?? '20')

    const [entries, total] = await Promise.all([
      db.entry.findMany({
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
        orderBy: { date: 'desc' },
        skip,
        take,
      }),
      db.entry.count(),
    ])

    // Parse tags from JSON strings
    const parsedEntries = entries.map((entry) => ({
      ...entry,
      tags: parseJSON(entry.tags, []),
    }))

    return NextResponse.json(
      { entries: parsedEntries, total, skip, take },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET /api/entries error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/entries
 * Creates a new entry with validation.
 * Stores tags as a JSON string in the database.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validatedData = createEntrySchema.parse(body)

    const entry = await db.entry.create({
      data: {
        title: validatedData.title,
        body: validatedData.body,
        tags: stringifyJSON(validatedData.tags),
        projectId: validatedData.projectId || null,
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

    return NextResponse.json(
      {
        ...entry,
        tags: parseJSON(entry.tags, []),
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('POST /api/entries error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}
