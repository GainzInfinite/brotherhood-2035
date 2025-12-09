import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/clans/[slug] - Get clan details, members, and posts
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get clan with members and posts
    const clan = await prisma.clan.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            clan: false // Don't include clan data in members
          },
          orderBy: { joinedAt: 'asc' }
        },
        posts: {
          include: {
            clan: false // Don't include clan data in posts
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { members: true, posts: true }
        }
      }
    })

    if (!clan) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
      )
    }

    // Check if user is a member
    const userMembership = clan.members.find(member => member.userId === userId)

    return NextResponse.json({
      success: true,
      clan: {
        id: clan.id,
        name: clan.name,
        slug: clan.slug,
        description: clan.description,
        createdAt: clan.createdAt,
        memberCount: clan._count.members,
        postCount: clan._count.posts,
        isMember: !!userMembership,
        userRole: userMembership?.role || null
      },
      members: clan.members.map(member => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt
      })),
      posts: clan.posts.map(post => ({
        id: post.id,
        userId: post.userId,
        content: post.content,
        createdAt: post.createdAt
      }))
    })
  } catch (error) {
    console.error('Get clan API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clan' },
      { status: 500 }
    )
  }
}

// POST /api/clans/[slug] - Create a new post in the clan
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    const body = await request.json()
    const { content } = body
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post content is required' },
        { status: 400 }
      )
    }

    // Get clan
    const clan = await prisma.clan.findUnique({
      where: { slug }
    })

    if (!clan) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
      )
    }

    // Check if user is a member
    const membership = await prisma.clanMember.findFirst({
      where: {
        clanId: clan.id,
        userId
      }
    })

    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'You must be a member of this clan to post' },
        { status: 403 }
      )
    }

    // Create post
    const post = await prisma.clanPost.create({
      data: {
        clanId: clan.id,
        userId,
        content: content.trim()
      }
    })

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        userId: post.userId,
        content: post.content,
        createdAt: post.createdAt
      }
    })
  } catch (error) {
    console.error('Create post API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}