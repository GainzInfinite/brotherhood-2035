const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testTrialSystem() {
  try {
    console.log('Testing trial system...\n')

    // 1. Check current user settings
    const userId = 'default-user'
    let settings = await prisma.userSettings.findUnique({
      where: { userId }
    })

    if (settings) {
      console.log('✓ Current Settings:')
      console.log('  - Trial Start:', settings.trialStartDate || 'Not set')
      console.log('  - Trial End:', settings.trialEndDate || 'Not set')
      console.log('  - Is Member:', settings.isMember)
      
      if (settings.trialEndDate) {
        const now = new Date()
        const daysLeft = Math.ceil((new Date(settings.trialEndDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        console.log('  - Days Left:', Math.max(0, daysLeft))
        console.log('  - Trial Active:', daysLeft > 0)
      }
    } else {
      console.log('✗ No user settings found')
    }

    console.log('\n✅ Trial system test complete!')
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testTrialSystem()
