"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const readline_1 = __importDefault(require("readline"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma/prisma");
const user_validator_1 = require("../services/user/user.validator");
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
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
// ===== readline =====
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// pergunta normal
function question(text) {
    return new Promise((resolve) => rl.question(text, resolve));
}
// pergunta com senha oculta
function questionHidden(query) {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const stdout = process.stdout;
        stdout.write(query);
        stdin.resume();
        stdin.setRawMode(true);
        let input = '';
        const onData = (char) => {
            const key = char.toString();
            if (key === '\n' || key === '\r') {
                stdin.setRawMode(false);
                stdin.removeListener('data', onData);
                stdout.write('\n');
                resolve(input);
            }
            else if (key === '\u0003') {
                process.exit();
            }
            else if (key === '\u007F') {
                input = input.slice(0, -1);
            }
            else {
                input += key;
            }
        };
        stdin.on('data', onData);
    });
}
// ===== comandos =====
async function create() {
    const email = await question('Email: ');
    const password = await questionHidden('Senha: ');
    const validation = (0, user_validator_1.validateUser)({ email, password });
    if (!validation.success) {
        console.log('Erro de validação:', validation.errors);
        return;
    }
    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = {
        email: normalizedEmail,
        password: hashedPassword,
        role: 'user',
    };
    try {
        await prisma_1.prisma.user.create({ data: user });
    }
    catch (error) {
        if (error.code === 'P2002') {
            console.log('Email já cadastrado');
            return;
        }
        throw error;
    }
    console.log('Usuário criado:', user.email);
}
async function deleteUser() {
    const email = await question('Email do usuário a deletar: ');
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('Usuário não encontrado');
        return;
    }
    const confirm = await question(`Tem certeza que deseja deletar ${email}? (s/n): `);
    if (confirm.toLowerCase() !== 's') {
        console.log('Operação cancelada');
        return;
    }
    // impedir deletar último admin
    if (user.role === 'admin') {
        const adminCount = await prisma_1.prisma.user.count({
            where: { role: 'admin' },
        });
        if (adminCount <= 1) {
            console.log('Não é permitido deletar o último admin!');
            return;
        }
    }
    await prisma_1.prisma.refreshToken.deleteMany({
        where: { userId: user.id },
    });
    await prisma_1.prisma.user.delete({
        where: { email },
    });
    console.log('Usuário deletado:', email);
}
async function promote() {
    const email = await question('Email do usuário: ');
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        console.log('Usuário não encontrado');
        return;
    }
    await prisma_1.prisma.user.update({
        where: { email },
        data: { role: 'admin' },
    });
    console.log('Promovido para admin:', user.email);
}
async function demote() {
    const email = await question('Email do usuário: ');
    const adminCount = await prisma_1.prisma.user.count({
        where: { role: 'admin' },
    });
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('Usuário não encontrado');
        return;
    }
    if (user.role === 'admin' && adminCount <= 1) {
        console.log('Não é permitido rebaixar o último admin!');
        return;
    }
    const updated = await prisma_1.prisma.user.update({
        where: { email },
        data: { role: 'user' },
    });
    console.log('Rebaixado para user:', updated.email);
}
async function list() {
    const users = await prisma_1.prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
    console.log('\nUsuários:');
    users.forEach((u) => {
        console.log(`#${u.id} - ${u.email} (${u.role})`);
    });
}
// ===== menu =====
async function main() {
    console.log('Bem-vindo ao CLI de gerenciamento de usuários!');
    console.log(`
Escolha uma opção:
${options}`);
    try {
        let choice;
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
    }
    catch (error) {
        console.error('Erro:', error);
    }
    finally {
        rl.close();
        await prisma_1.prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=userCLI.js.map