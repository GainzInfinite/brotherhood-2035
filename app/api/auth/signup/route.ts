import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log("SIGNUP ROUTE HIT");
    const { name, email, password } = await request.json()

    console.log("Signup payload:", { name, email, password })

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Create user (password hashing will be implemented later with proper auth flow)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        onboardingComplete: false,
        emailVerified: null,
      },
    })

    // Create UserSettings with trial
    const trialStartDate = new Date()
    const trialEndDate = new Date()
    trialEndDate.setDate(trialStartDate.getDate() + 14) // 14-day trial

    await prisma.userSettings.create({
      data: {
        userId: user.id,
        trialStartDate,
        trialEndDate,
        isMember: false,
        onboardingComplete: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
     console.error("SIGNUP ERROR:", e instanceof Error ? e.stack : e);
    return NextResponse.json(
      { error: "Something went wrong" },
       
    )
  }
}
