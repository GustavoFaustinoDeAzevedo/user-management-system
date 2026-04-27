import { prisma } from '../lib/prisma/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'admin@email.com1';

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Admin já existe');
    return;
  }

  const password = await bcrypt.hash('Admin@123', 10);

  await prisma.user.create({
    data: {
      email,
      password,
      role: 'admin',
    },
  });

  console.log('Admin criado com sucesso');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
