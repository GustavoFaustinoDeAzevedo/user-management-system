"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    const email = 'admin@email.com';
    const existing = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (existing) {
        console.log('Admin já existe');
        return;
    }
    const password = await bcrypt_1.default.hash('Admin@123', 10);
    await prisma_1.prisma.user.create({
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
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map