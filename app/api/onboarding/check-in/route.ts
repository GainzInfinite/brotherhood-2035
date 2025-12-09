import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const formData = await request.formData()

    // Parse form data
    const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null
    const benchMax = formData.get('benchMax') ? parseFloat(formData.get('benchMax') as string) : null
    const squatMax = formData.get('squatMax') ? parseFloat(formData.get('squatMax') as string) : null
    const totalSavings = formData.get('totalSavings') ? parseFloat(formData.get('totalSavings') as string) : null
    const energyLevel = formData.get('energyLevel') ? parseInt(formData.get('energyLevel') as string) : 7
    const wins = formData.get('wins') as string
    const challenges = formData.get('challenges') as string

    // Set date to today
    const date = new Date()
    date.setHours(0, 0, 0, 0)

    // Create initial daily log with onboarding data
    await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        weight,
        // Store bench max as pushups for now (simplified)
        pushups: benchMax ? Math.floor(benchMax) : null,
        // Store squat max as steps (simplified mapping)
        steps: squatMax ? Math.floor(squatMax) : null,
        // Store total savings as savings today
        savingsToday: totalSavings,
        // Store energy level as consistency score
        consistencyScore: energyLevel,
        updatedAt: new Date(),
      },
      create: {
        userId,
        date,
        weight,
        pushups: benchMax ? Math.floor(benchMax) : null,
        steps: squatMax ? Math.floor(squatMax) : null,
        savingsToday: totalSavings,
        consistencyScore: energyLevel,
      },
    })

  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  // Redirect to membership page
  redirect('/onboarding/membership')
}