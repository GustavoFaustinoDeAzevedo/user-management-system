"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("../lib/prisma/prisma");
async function main() {
    console.log('Deletando TODOS os usuários...');
    await prisma_1.prisma.refreshToken.deleteMany();
    await prisma_1.prisma.user.deleteMany();
    console.log('Todos os usuários foram removidos');
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=delete-users.js.map