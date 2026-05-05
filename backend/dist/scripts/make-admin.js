"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const prisma_1 = require("../lib/prisma/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function question(text) {
    return new Promise((resolve) => rl.question(text, resolve));
}
async function main() {
    console.log('SCRIPT cwd:', process.cwd());
    console.log('SCRIPT DATABASE_URL:', process.env.DATABASE_URL);
    console.log('Criando admin...');
    const email = await question('Email: ');
    const password = await question('Senha: ');
    console.log('');
    console.log('Senha recebida para criar admin:', password);
    const hashedPassword = await bcrypt_1.default.hash('Admin@123', 10);
    console.log('Hash gerado:', hashedPassword);
    console.log('');
    const user = await prisma_1.prisma.user.upsert({
        where: { email },
        update: { role: 'admin' },
        create: {
            email,
            password: hashedPassword,
            role: 'admin',
        },
    });
    console.log('Admin garantido:', user.email);
    rl.close();
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=make-admin.js.map