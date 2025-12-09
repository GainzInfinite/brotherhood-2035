const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { id: 'default-user' },
    update: { onboardingComplete: false },
    create: { id: 'default-user', onboardingComplete: false }
  })
  console.log('Set default-user onboardingComplete=false')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
