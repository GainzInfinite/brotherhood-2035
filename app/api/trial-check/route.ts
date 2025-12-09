import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from middleware header or resolve session on the server
    let userId = request.headers.get('user-id')

    if (!userId) {
      const session = await auth()
      userId = session?.user?.id as string | undefined
    }

    if (!userId) {
      return NextResponse.json({
        onboardingComplete: false,
        isMember: false,
        trialActive: false
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingComplete: true }
    })

    if (!user) {
      return NextResponse.json({
        onboardingComplete: false,
        isMember: false,
        trialActive: false
      })
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: {
        onboardingComplete: true,
        isMember: true,
        trialEndDate: true
      }
    })

    if (!settings) {
      return NextResponse.json({
        onboardingComplete: user.onboardingComplete,
        isMember: false,
        trialActive: false
      })
    }

    // Check if trial is still active
    const now = new Date()
    const trialActive = settings.trialEndDate ? now <= settings.trialEndDate : false

    return NextResponse.json({
      onboardingComplete: user.onboardingComplete,
      isMember: settings.isMember,
      trialActive
    })
  } catch (error) {
    console.error('Trial check error:', error)
    return NextResponse.json({ 
      onboardingComplete: false,
      isMember: false,
      trialActive: false
    }, { status: 500 })
  }
}
