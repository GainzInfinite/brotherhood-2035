const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function setTrialOneDayLeft() {
  try {
    const userId = 'default-user'
    
    // Set trial to expire tomorrow (1 day left)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    await prisma.userSettings.update({
      where: { userId },
      data: {
        trialEndDate: tomorrow
      }
    })
    
    console.log('✓ Trial set to 1 day left (Day 13)')
    console.log('  Trial End Date:', tomorrow.toISOString())
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setTrialOneDayLeft()
