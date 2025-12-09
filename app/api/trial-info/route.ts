import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: {
        isMember: true,
        trialStartDate: true,
        trialEndDate: true
      }
    })

    if (!settings) {
      return NextResponse.json({
        success: true,
        trial: {
          isActive: false,
          daysLeft: 0,
          isMember: false
        }
      })
    }

    // If user is a member, no trial info needed
    if (settings.isMember) {
      return NextResponse.json({
        success: true,
        trial: {
          isActive: false,
          daysLeft: 0,
          isMember: true
        }
      })
    }

    // Calculate days left in trial
    if (settings.trialEndDate) {
      const now = new Date()
      const endDate = new Date(settings.trialEndDate)
      const diffTime = endDate.getTime() - now.getTime()
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return NextResponse.json({
        success: true,
        trial: {
          isActive: daysLeft > 0,
          daysLeft: Math.max(0, daysLeft),
          isMember: false
        }
      })
    }

    return NextResponse.json({
      success: true,
      trial: {
        isActive: false,
        daysLeft: 0,
        isMember: false
      }
    })
  } catch (error) {
    console.error('Trial info error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch trial info'
    }, { status: 500 })
  }
}
