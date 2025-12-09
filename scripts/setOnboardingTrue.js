const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { id: 'default-user' },
    update: { onboardingComplete: true },
    create: { id: 'default-user', onboardingComplete: true }
  })
  console.log('Set default-user onboardingComplete=true')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
