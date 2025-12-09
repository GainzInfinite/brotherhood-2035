import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Mark onboarding as complete
    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingComplete: true
      }
    })

    // Activate 14-day free trial
    const now = new Date()
    const trialEnd = new Date(now)
    trialEnd.setDate(trialEnd.getDate() + 14)

    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        trialStartDate: now,
        trialEndDate: trialEnd,
        isMember: false,
        onboardingComplete: true
      },
      create: {
        userId,
        trialStartDate: now,
        trialEndDate: trialEnd,
        isMember: false,
        onboardingComplete: true
      }
    })

  } catch (error) {
    console.error('Onboarding completion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  // Return JSON; client will handle redirect to command center
  return NextResponse.json({ success: true })
}