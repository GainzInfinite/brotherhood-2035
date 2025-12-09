import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { welcomePopupShown } = body

    // Update the user
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { welcomePopupShown }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 })
  }
}