import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/clans - List all clans with member counts
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get all clans with member counts
    const clans = await prisma.clan.findMany({
      include: {
        _count: {
          select: { members: true }
        },
        members: {
          where: { userId },
          select: { role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data for frontend
    const transformedClans = clans.map(clan => ({
      id: clan.id,
      name: clan.name,
      slug: clan.slug,
      description: clan.description,
      memberCount: clan._count.members,
      isMember: clan.members.length > 0,
      role: clan.members[0]?.role || null
    }))

    // Get user's clan membership
    const userMembership = await prisma.clanMember.findFirst({
      where: { userId },
      include: {
        clan: true
      }
    })

    return NextResponse.json({
      success: true,
      clans: transformedClans,
      userClan: userMembership ? {
        id: userMembership.clan.id,
        name: userMembership.clan.name,
        slug: userMembership.clan.slug,
        role: userMembership.role
      } : null
    })
  } catch (error) {
    console.error('Clans API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clans' },
      { status: 500 }
    )
  }
}

// POST /api/clans - Create a new clan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Clan name is required' },
        { status: 400 }
      )
    }

    // Create slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if slug is unique
    const existingClan = await prisma.clan.findFirst({
      where: { OR: [{ name }, { slug }] }
    })

    if (existingClan) {
      return NextResponse.json(
        { success: false, error: 'Clan name or slug already exists' },
        { status: 400 }
      )
    }

    // Check if user is already in a clan
    const existingMembership = await prisma.clanMember.findFirst({
      where: { userId }
    })

    if (existingMembership) {
      return NextResponse.json(
        { success: false, error: 'You are already a member of a clan' },
        { status: 400 }
      )
    }

    // Create clan and add creator as leader
    const clan = await prisma.clan.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim(),
        createdBy: userId,
        members: {
          create: {
            userId,
            role: 'leader'
          }
        }
      },
      include: {
        members: true
      }
    })

    return NextResponse.json({
      success: true,
      clan: {
        id: clan.id,
        name: clan.name,
        slug: clan.slug,
        description: clan.description
      }
    })
  } catch (error) {
    console.error('Create clan API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create clan' },
      { status: 500 }
    )
  }
}