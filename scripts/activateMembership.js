// Test script to activate membership for default user
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function activateMembership() {
  try {
    const userId = 'default-user';
    
    // Update user settings to activate membership
    const result = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        isMember: true,
        trialEndDate: null,
      },
      create: {
        userId,
        isMember: true,
        trialEndDate: null,
      },
    });
    
    console.log('✓ Membership activated successfully!');
    console.log('User Settings:', result);
    
  } catch (error) {
    console.error('Error activating membership:', error);
  } finally {
    await prisma.$disconnect();
  }
}

activateMembership();
