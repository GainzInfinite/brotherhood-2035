import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const latest = await prisma.expenseLog.findFirst({
      where: { userId: user.id },
      orderBy: { expenseDate: 'desc' }
    })

    if (!latest) {
      return NextResponse.json({ success: true, latest: null })
    }

    return NextResponse.json({ success: true, latest })
  } catch (error) {
    console.error('Latest expense error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
