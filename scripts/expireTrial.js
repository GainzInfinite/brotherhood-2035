const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function expireTrial() {
  try {
    const userId = 'default-user'
    
    // Set trial to expire yesterday
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    await prisma.userSettings.update({
      where: { userId },
      data: {
        trialEndDate: yesterday
      }
    })
    
    console.log('✓ Trial expired for testing')
    console.log('  Trial End Date:', yesterday.toISOString())
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

expireTrial()
