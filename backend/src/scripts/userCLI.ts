import 'dotenv/config';
import readline from 'readline';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma/prisma';
import { validateUser } from '../services/user/user.validator';

// Garantir que o Prisma seja desconectado ao encerrar o processo

const options = `
1 - Criar usuário
2 - Deletar usuário
3 - Promover para admin
4 - Rebaixar para user
5 - Listar usuários
6 ou help - Listar opções
Qualquer outra tecla para sair
`;

process.on('SIGINT', async () => {
  console.log('\nEncerrando...');
  await prisma.$disconnect();
  process.exit(0);
});

// ===== readline =====
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// pergunta normal
function question(text: string): Promise<string> {
  return new Promise((resolve) => rl.question(text, resolve));
}

// pergunta com senha oculta
function questionHidden(query: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    stdout.write(query);
    stdin.resume();
    stdin.setRawMode(true);

    let input = '';

    stdin.on('data', (char: Buffer) => {
      const key = char.toString();

      if (key === '\n' || key === '\r') {
        stdin.setRawMode(false);
        stdout.write('\n');
        resolve(input);
      } else if (key === '\u0003') {
        process.exit();
      } else if (key === '\u007F') {
        input = input.slice(0, -1);
      } else {
        input += key;
      }
    });
  });
}

// ===== comandos =====

async function create() {
  const email = await question('Email: ');
  const password = await questionHidden('Senha: ');

  const validation = validateUser({ email, password });

  if (!validation.success) {
    console.log('Erro de validação:', validation.errors);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
    },
  });

  console.log('Usuário criado:', user.email);
}

async function deleteUser() {
  const email = await question('Email do usuário a deletar: ');

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log('Usuário não encontrado');
    return;
  }

  const confirm = await question(
    `Tem certeza que deseja deletar ${email}? (s/n): `,
  );

  if (confirm.toLowerCase() !== 's') {
    console.log('Operação cancelada');
    return;
  }

  // impedir deletar último admin
  if (user.role === 'admin') {
    const adminCount = await prisma.user.count({
      where: { role: 'admin' },
    });

    if (adminCount <= 1) {
      console.log('Não é permitido deletar o último admin!');
      return;
    }
  }

  await prisma.refreshToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.user.delete({
    where: { email },
  });

  console.log('Usuário deletado:', email);
}

async function promote() {
  const email = await question('Email do usuário: ');

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'admin' },
  });

  console.log('Promovido para admin:', user.email);
}

async function demote() {
  const email = await question('Email do usuário: ');

  const adminCount = await prisma.user.count({
    where: { role: 'admin' },
  });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log('Usuário não encontrado');
    return;
  }

  if (user.role === 'admin' && adminCount <= 1) {
    console.log('Não é permitido rebaixar o último admin!');
    return;
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: 'user' },
  });

  console.log('Rebaixado para user:', updated.email);
}

async function list() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
    },
  });

  console.log('\nUsuários:');
  users.forEach((u) => {
    console.log(`- ${u.email} (${u.role})`);
  });
}

// ===== menu =====

async function main() {
  console.log('Bem-vindo ao CLI de gerenciamento de usuários!');
  console.log(`
Escolha uma opção:
${options}`);
  try {
    let choice: string;
    let running = true;

    while (running) {
      choice = await question('Opção: ');
      switch (choice) {
        case '1':
          await create();
          break;
        case '2':
          await deleteUser();
          break;
        case '3':
          await promote();
          break;
        case '4':
          await demote();
          break;
        case '5':
          await list();
          break;
        case '6':
          console.log(options);
          break;
        case 'help':
          console.log(options);
          break;
        default:
          console.log('Encerrando...');
          running = false;
      }
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
