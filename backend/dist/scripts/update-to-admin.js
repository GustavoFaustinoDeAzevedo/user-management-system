"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma/prisma");
async function main() {
    const email = 'admin@email.com';
    console.log('Procurando usuário:', email);
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    console.log('Usuário achado:', user);
    if (!user) {
        console.log('Usuário não existe');
        return;
    }
    const updated = await prisma_1.prisma.user.update({
        where: { email },
        data: { role: 'admin' },
    });
    console.log('Promovido para admin:', updated.email);
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=update-to-admin.js.map