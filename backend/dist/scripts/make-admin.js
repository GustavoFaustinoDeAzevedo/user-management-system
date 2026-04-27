"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma/prisma");
async function main() {
    const email = 'admin@email.com';
    const user = await prisma_1.prisma.user.update({
        where: { email },
        data: { role: 'admin' },
    });
    console.log('Promovido para admin:', user.email);
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=make-admin.js.map