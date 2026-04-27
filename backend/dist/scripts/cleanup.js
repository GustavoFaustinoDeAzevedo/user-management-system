"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma/prisma");
async function main() {
    const now = new Date();
    const deleted = await prisma_1.prisma.refreshToken.deleteMany({
        where: {
            expiresAt: {
                lt: now,
            },
        },
    });
    console.log(`Tokens removidos: ${deleted.count}`);
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=cleanup.js.map