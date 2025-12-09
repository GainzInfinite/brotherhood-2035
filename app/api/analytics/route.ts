import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    
    let startDate: Date
    let endDate: Date

    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam)
      endDate = new Date(endDateParam)
      // Set end date to end of day to include all logs for that day
      endDate.setHours(23, 59, 59, 999)
    } else {
      const days = parseInt(searchParams.get('days') || '30')
      endDate = new Date()
      startDate = new Date()
      startDate.setDate(endDate.getDate() - days)
    }

    // Fetch daily logs for the specified period
    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Fetch income logs for the specified period
    const incomeLogs = await prisma.incomeLog.findMany({
      where: {
        userId,
        receivedDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        receivedDate: 'asc',
      },
    })

    // Fetch journal entries for the specified period
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Process weight trend data
    const weightData = dailyLogs
      .filter(log => log.weight !== null)
      .map(log => ({
        date: log.date.toISOString().split('T')[0],
        weight: log.weight,
      }))

    // Calculate 7-day moving average for weight
    const weightWithMA = weightData.map((item, index) => {
      const start = Math.max(0, index - 6)
      const values = weightData.slice(start, index + 1).map(d => d.weight!)
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length
      return {
        ...item,
        movingAverage: Math.round(avg * 10) / 10,
      }
    })

    // Weight summary
    const weights = weightData.map(d => d.weight!).filter(w => w !== null)
    const weightSummary = weights.length > 0 ? {
      change30d: weights.length > 1 ? Math.round((weights[weights.length - 1] - weights[0]) * 10) / 10 : 0,
      lowest: Math.min(...weights),
      highest: Math.max(...weights),
    } : null

    // Pushup heatmap data (last 30 days)
    const pushupData = dailyLogs
      .filter(log => log.pushups !== null)
      .map(log => ({
        date: log.date.toISOString().split('T')[0],
        pushups: log.pushups,
      }))

    // Steps trend data
    const stepsData = dailyLogs
      .filter(log => log.steps !== null)
      .map(log => ({
        date: log.date.toISOString().split('T')[0],
        steps: log.steps,
      }))

    // Steps summary
    const stepsValues = stepsData.map(d => d.steps!)
    const stepsSummary = stepsValues.length > 0 ? {
      avg7d: Math.round(stepsValues.slice(-7).reduce((sum, val) => sum + val, 0) / Math.min(7, stepsValues.length)),
      change30d: stepsValues.length > 1 ?
        Math.round(((stepsValues[stepsValues.length - 1] - stepsValues[0]) / stepsValues[0]) * 100) : 0,
    } : null

    // Meditation trend data
    const meditationData = dailyLogs
      .filter(log => log.meditationMinutes !== null)
      .map(log => ({
        date: log.date.toISOString().split('T')[0],
        minutes: log.meditationMinutes,
      }))

    // Meditation summary
    const meditationValues = meditationData.map(d => d.minutes!)
    const meditationSummary = meditationValues.length > 0 ? {
      today: meditationValues[meditationValues.length - 1] || 0,
      avg7d: Math.round(meditationValues.slice(-7).reduce((sum, val) => sum + val, 0) / Math.min(7, meditationValues.length)),
      change30d: meditationValues.length > 1 ?
        Math.round(((meditationValues[meditationValues.length - 1] - meditationValues[0]) / meditationValues[0]) * 100) : 0,
    } : null

    // Study & Reading trend data
    const studyData = dailyLogs
      .filter(log => log.studyMinutes !== null)
      .map(log => ({
        date: log.date.toISOString().split('T')[0],
        minutes: log.studyMinutes,
      }))

    const readingData = dailyLogs
      .filter(log => log.readingMinutes !== null)
      .map(log => ({
        date: log.date.toISOString().split('T')[0],
        minutes: log.readingMinutes,
      }))

    // Spending trend data
    const spendingData = dailyLogs
      .filter(log => log.spendToday !== null)
      .map(log => ({
        date: log.date.toISOString().split('T')[0],
        amount: log.spendToday,
      }))

    // Spending summary
    const spendingValues = spendingData.map(d => d.amount!)
    const spendingSummary = spendingValues.length > 0 ? {
      today: spendingValues[spendingValues.length - 1] || 0,
      avg7d: Math.round(spendingValues.slice(-7).reduce((sum, val) => sum + val, 0) / Math.min(7, spendingValues.length) * 100) / 100,
      change30d: spendingValues.length > 1 ?
        Math.round(((spendingValues[spendingValues.length - 1] - spendingValues[0]) / spendingValues[0]) * 100) : 0,
    } : null

    // Income trend data (monthly aggregation)
    const monthlyIncome = incomeLogs.reduce((acc, log) => {
      const monthKey = log.receivedDate.toISOString().slice(0, 7) // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, labor: 0, passive: 0, sources: {} }
      }
      acc[monthKey].total += log.amount
      if (log.incomeType === 'labor') {
        acc[monthKey].labor += log.amount
      } else {
        acc[monthKey].passive += log.amount
      }
      acc[monthKey].sources[log.source] = (acc[monthKey].sources[log.source] || 0) + log.amount
      return acc
    }, {} as Record<string, { total: number; labor: number; passive: number; sources: Record<string, number> }>)

    const incomeMonthlyData = Object.entries(monthlyIncome).map(([month, data]) => ({
      month,
      total: Math.round(data.total * 100) / 100,
      labor: Math.round(data.labor * 100) / 100,
      passive: Math.round(data.passive * 100) / 100,
    }))

    // YTD cumulative income
    const currentYear = new Date().getFullYear()
    const ytdIncome = incomeLogs
      .filter(log => log.receivedDate.getFullYear() === currentYear)
      .sort((a, b) => a.receivedDate.getTime() - b.receivedDate.getTime())
      .reduce((acc, log, index) => {
        const cumulative = acc[index - 1]?.cumulative || 0
        acc.push({
          date: log.receivedDate.toISOString().split('T')[0],
          cumulative: Math.round((cumulative + log.amount) * 100) / 100,
        })
        return acc
      }, [] as { date: string; cumulative: number }[])

    // Consistency score trend data
    const consistencyData = dailyLogs
      .filter(log => log.consistencyScore !== null)
      .map(log => ({
        date: log.date.toISOString().split('T')[0],
        score: log.consistencyScore,
      }))

    // Consistency summary
    const consistencyValues = consistencyData.map(d => d.score!)
    const consistencySummary = consistencyValues.length > 0 ? {
      avg7d: Math.round(consistencyValues.slice(-7).reduce((sum, val) => sum + val, 0) / Math.min(7, consistencyValues.length)),
      improvement30d: consistencyValues.length > 1 ?
        Math.round(((consistencyValues[consistencyValues.length - 1] - consistencyValues[0]) / consistencyValues[0]) * 100) : 0,
    } : null

    // Journal word count trend
    const journalData = journalEntries.map(entry => ({
      date: entry.date.toISOString().split('T')[0],
      wordCount: entry.content.split(/\s+/).filter(w => w.length > 0).length,
    }))

    return NextResponse.json({
      success: true,
      data: {
        weight: {
          data: weightWithMA,
          summary: weightSummary,
        },
        pushups: pushupData,
        steps: {
          data: stepsData,
          summary: stepsSummary,
        },
        meditation: {
          data: meditationData,
          summary: meditationSummary,
        },
        study: studyData,
        reading: readingData,
        spending: {
          data: spendingData,
          summary: spendingSummary,
        },
        income: {
          monthly: incomeMonthlyData,
          ytd: ytdIncome,
        },
        consistency: {
          data: consistencyData,
          summary: consistencySummary,
        },
        journal: journalData,
      },
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}