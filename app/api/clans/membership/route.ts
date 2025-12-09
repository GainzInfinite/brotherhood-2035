import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/clans/membership - Join a clan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clanId } = body
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    if (!clanId) {
      return NextResponse.json(
        { success: false, error: 'Clan ID is required' },
        { status: 400 }
      )
    }

    // Check if clan exists
    const clan = await prisma.clan.findUnique({
      where: { id: parseInt(clanId) }
    })

    if (!clan) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
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

    // Join the clan
    const membership = await prisma.clanMember.create({
      data: {
        clanId: parseInt(clanId),
        userId,
        role: 'member'
      },
      include: {
        clan: true
      }
    })

    return NextResponse.json({
      success: true,
      membership: {
        clanId: membership.clanId,
        clanName: membership.clan.name,
        clanSlug: membership.clan.slug,
        role: membership.role
      }
    })
  } catch (error) {
    console.error('Join clan API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to join clan' },
      { status: 500 }
    )
  }
}

// DELETE /api/clans/membership - Leave a clan
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Find user's membership
    const membership = await prisma.clanMember.findFirst({
      where: { userId },
      include: { clan: true }
    })

    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'You are not a member of any clan' },
        { status: 400 }
      )
    }

    // If user is the only leader, allow deleting the clan when they're the only member
    if (membership.role === 'leader') {
      const leaderCount = await prisma.clanMember.count({
        where: {
          clanId: membership.clanId,
          role: 'leader'
        }
      })

      const memberCount = await prisma.clanMember.count({
        where: {
          clanId: membership.clanId
        }
      })

      if (leaderCount === 1 && memberCount === 1) {
        // Delete the clan (cascade should remove members/posts via DB relations)
        await prisma.clan.delete({ where: { id: membership.clanId } })
        return NextResponse.json({ success: true, deletedClan: { name: membership.clan.name, slug: membership.clan.slug } })
      }

      if (leaderCount === 1) {
        return NextResponse.json(
          { success: false, error: 'Cannot leave clan as the only leader. Transfer leadership first.' },
          { status: 400 }
        )
      }
    }

    // Remove membership
    await prisma.clanMember.delete({
      where: { id: membership.id }
    })

    return NextResponse.json({
      success: true,
      leftClan: {
        name: membership.clan.name,
        slug: membership.clan.slug
      }
    })
  } catch (error) {
    console.error('Leave clan API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to leave clan' },
      { status: 500 }
    )
  }
}