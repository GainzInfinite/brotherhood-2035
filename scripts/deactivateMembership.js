// Test script to deactivate membership and restore trial for default user
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deactivateMembership() {
  try {
    const userId = 'default-user';
    
    // Calculate 14-day trial from now
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);
    
    // Update user settings to deactivate membership and restore trial
    const result = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        isMember: false,
        trialStartDate: new Date(),
        trialEndDate: trialEnd,
      },
      create: {
        userId,
        isMember: false,
        trialStartDate: new Date(),
        trialEndDate: trialEnd,
      },
    });
    
    console.log('✓ Membership deactivated and trial restored!');
    console.log('User Settings:', result);
    console.log(`Trial ends: ${trialEnd.toLocaleDateString()}`);
    
  } catch (error) {
    console.error('Error deactivating membership:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deactivateMembership();
