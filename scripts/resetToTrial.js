// scripts/resetToTrial.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const userId = 'default-user' // As defined in lib/auth.ts

  try {
    // Ensure the user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: { onboardingComplete: true },
      create: {
        id: userId,
        onboardingComplete: true,
      },
    })

    // Set user to be a non-member with an active trial
    const trialStartDate = new Date()
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 7) // Set a 7-day trial

    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        isMember: false,
        trialStartDate,
        trialEndDate,
      },
      create: {
        userId,
        isMember: false,
        trialStartDate,
        trialEndDate,
      },
    })

    console.log(`✅ User '${userId}' reset to a non-member state with an active 7-day trial.`)
    const settings = await prisma.userSettings.findUnique({ where: { userId } })
    console.log('Current settings:', settings)
  } catch (error) {
    console.error('Error resetting user to trial state:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
