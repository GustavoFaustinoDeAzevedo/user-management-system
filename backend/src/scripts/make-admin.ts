import { prisma } from '../lib/prisma/prisma';

async function main() {
  const email = 'admin@email.com';

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'admin' },
  });

  console.log('Promovido para admin:', user.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
