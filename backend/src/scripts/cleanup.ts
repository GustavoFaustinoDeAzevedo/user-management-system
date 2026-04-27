import { prisma } from '../lib/prisma/prisma';

async function main() {
  const now = new Date();

  const deleted = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  console.log(`Tokens removidos: ${deleted.count}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });