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
        stdin.on('data', (char) => {
            const key = char.toString();
            if (key === '\n' || key === '\r') {
                stdin.setRawMode(false);
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
        });
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
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
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
    const user = await prisma_1.prisma.user.update({
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
    console.log(`
Escolha uma opção:

1 - Criar usuário
2 - Deletar usuário
3 - Promover para admin
4 - Rebaixar para user
5 - Listar usuários
`);
    const choice = await question('Opção: ');
    try {
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
            default:
                console.log('Opção inválida');
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