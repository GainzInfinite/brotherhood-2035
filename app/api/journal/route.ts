import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, content, title, tags, imageUrl } = body

    if (!date || content === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const entryDate = new Date(date)
    // Normalize to midnight UTC to match the page.tsx logic
    // This ensures that 2023-01-01T12:00:00 becomes 2023-01-01T00:00:00Z
    // which matches new Date('2023-01-01')
    const normalizedDate = new Date(Date.UTC(
      entryDate.getFullYear(),
      entryDate.getMonth(),
      entryDate.getDate()
    ))

    // Upsert the entry
    const entry = await prisma.journalEntry.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: normalizedDate,
        }
      },
      update: {
        content,
        title,
        tags: tags || "[]",
        imageUrl: imageUrl || null,
      },
      create: {
        userId: user.id,
        date: normalizedDate,
        content,
        title,
        tags: tags || "[]",
        imageUrl: imageUrl || null,
      }
    })

    return NextResponse.json({ success: true, data: entry })
  } catch (error) {
    console.error('Error saving journal entry:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    if (!dateParam) {
      return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 })
    }

    const entryDate = new Date(dateParam)
    const normalizedDate = new Date(Date.UTC(
      entryDate.getFullYear(),
      entryDate.getMonth(),
      entryDate.getDate()
    ))

    await prisma.journalEntry.delete({
      where: {
        userId_date: {
          userId: user.id,
          date: normalizedDate,
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
