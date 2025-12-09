import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const username = formData.get('username') as string
    const location = formData.get('location') as string
    const timezone = formData.get('timezone') as string
    const fatherhoodEnabled = formData.get('fatherhoodEnabled') === 'true'

    if (!username?.trim()) {
      return NextResponse.json({ errors: { username: 'Username is required' } }, { status: 400 })
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username.trim(),
        id: { not: user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json({ errors: { username: 'Username already taken' } }, { status: 400 })
    }

    // Update user profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: username.trim(),
        location: location?.trim() || null,
        timezone: timezone || null,
        fatherhoodEnabled
      }
    })

    // Ensure UserSettings exists
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id }
    })

    if (!userSettings) {
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          enableFatherhoodModule: fatherhoodEnabled
        }
      })
    }

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Unable to save profile. Please try again.' }, { status: 400 })
  }

  // Return success JSON so client can redirect
  return NextResponse.json({ success: true })
}