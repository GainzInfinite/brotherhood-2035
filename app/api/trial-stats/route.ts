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

    // Get user stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true }
    })

    // Get streak/check-in count
    const dailyLogsCount = await prisma.dailyLog.count({
      where: { userId }
    })

    // Get latest consistency score
    const latestLog = await prisma.dailyLog.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { consistencyScore: true }
    })

    // Get income logs count
    const incomeLogsCount = await prisma.incomeLog.count({
      where: { userId }
    })

    // Get journal entries count
    const journalCount = await prisma.journalEntry.count({
      where: { userId }
    })

    return NextResponse.json({
      success: true,
      stats: {
        level: user?.level || 1,
        xp: user?.xp || 0,
        checkIns: dailyLogsCount,
        consistencyScore: latestLog?.consistencyScore || 0,
        incomeLogsCount,
        journalCount
      }
    })
  } catch (error) {
    console.error('Trial stats error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch stats'
    }, { status: 500 })
  }
}
