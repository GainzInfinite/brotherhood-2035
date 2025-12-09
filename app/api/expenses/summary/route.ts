import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const startMonth = startOfMonth(now)
    const endMonth = endOfMonth(now)
    const startYear = startOfYear(now)
    const endYear = endOfYear(now)

    const [monthExpenses, ytdExpenses] = await Promise.all([
      prisma.expenseLog.findMany({
        where: { userId: user.id, expenseDate: { gte: startMonth, lte: endMonth } },
        select: { amount: true }
      }),
      prisma.expenseLog.findMany({
        where: { userId: user.id, expenseDate: { gte: startYear, lte: endYear } },
        select: { amount: true }
      })
    ])

    const monthly = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    const ytd = ytdExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)

    return NextResponse.json({ success: true, summary: { monthly, ytd } })
  } catch (error) {
    console.error('Expense summary error:', error)
    return NextResponse.json({ success: true, summary: { monthly: 0, ytd: 0 } })
  }
}
