const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function setTrialDay(daysFromNow) {
  try {
    const userId = 'default-user'
    
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + daysFromNow)
    
    await prisma.userSettings.update({
      where: { userId },
      data: {
        trialEndDate: endDate
      }
    })
    
    console.log(`✓ Trial set to ${daysFromNow} day(s) from now`)
    console.log(`  Trial End Date: ${endDate.toISOString()}`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get command line argument
const daysFromNow = parseInt(process.argv[2]) || 14

setTrialDay(daysFromNow)
