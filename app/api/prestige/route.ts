import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canPrestige } from '@/lib/prestige'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get current user data
    let user = await prisma.user.findUnique({
      where: { id: userId }
    })

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId }
      })
    }

    // Check if user can prestige
    const prestigeCheck = canPrestige(user)
    if (!prestigeCheck.canPrestige) {
      return NextResponse.json(
        { success: false, error: prestigeCheck.message },
        { status: 400 }
      )
    }

    // Perform prestige
    const newPrestigeRank = user.prestigeRank + 1
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        prestigeRank: newPrestigeRank,
        prestigeDate: new Date(),
        xp: 0,
        level: 1
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        xp: updatedUser.xp,
        level: updatedUser.level,
        prestigeRank: updatedUser.prestigeRank,
        prestigeDate: updatedUser.prestigeDate
      },
      message: `Ascended to Prestige Rank ${newPrestigeRank}!`
    })
  } catch (error) {
    console.error('Prestige API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to prestige' },
      { status: 500 }
    )
  }
}

// GET /api/prestige - Get user prestige data
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    let user = await prisma.user.findUnique({
      where: { id: userId }
    })

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId }
      })
    }

    const prestigeCheck = canPrestige(user)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        xp: user.xp,
        level: user.level,
        prestigeRank: user.prestigeRank,
        prestigeDate: user.prestigeDate
      },
      canPrestige: prestigeCheck.canPrestige,
      prestigeMessage: prestigeCheck.message,
      nextRank: prestigeCheck.nextRank
    })
  } catch (error) {
    console.error('Get prestige API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get prestige data' },
      { status: 500 }
    )
  }
}