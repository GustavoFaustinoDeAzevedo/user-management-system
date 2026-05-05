"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.getUsers = getUsers;
exports.updateUserById = updateUserById;
exports.refreshAccessToken = refreshAccessToken;
exports.logout = logout;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma/prisma");
const user_validator_1 = require("./user.validator");
async function createUser(input) {
    const result = (0, user_validator_1.validateUser)(input);
    if (!result.success) {
        return result;
    }
    const email = result.data.email.toLowerCase().trim();
    const hashedPassword = await bcrypt_1.default.hash(result.data.password, 10);
    try {
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'user',
            },
        });
        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            return {
                success: false,
                errors: {
                    email: ['Email already in use'],
                    password: [],
                },
            };
        }
        throw error;
    }
}
async function loginUser(input) {
    console.log('Input bruto do loginUser:', input);
    const result = (0, user_validator_1.validateUserBase)(input);
    console.log('Resultado da validação:', result);
    if (!result.success) {
        return result;
    }
    const email = result.data.email.toLowerCase().trim();
    console.log('Email normalizado:', email);
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    console.log('Usuário encontrado:', user);
    if (!user) {
        return {
            success: false,
            errors: {
                email: ['Invalid credentials'],
                password: [],
            },
        };
    }
    const passwordMatch = await bcrypt_1.default.compare(result.data.password, user.password);
    console.log('Senha confere?', passwordMatch);
    if (!passwordMatch) {
        return {
            success: false,
            errors: {
                email: ['Invalid credentials'],
                password: [],
            },
        };
    }
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT secrets not defined');
    }
    const accessToken = jsonwebtoken_1.default.sign({
        id: user.id,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    await prisma_1.prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        success: true,
        data: {
            accessToken,
            refreshToken,
        },
    };
}
async function getUsers() {
    const users = (await prisma_1.prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
        },
    }));
    return users;
}
async function updateUserById(id, input) {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!existingUser) {
        return { success: false, error: 'User not found' };
    }
    const result = (0, user_validator_1.validateUpdateUser)(input);
    if (!result.success) {
        return result;
    }
    const dataToUpdate = {};
    if (result.data.email !== undefined) {
        dataToUpdate.email = result.data.email.toLowerCase().trim();
    }
    if (result.data.password !== undefined) {
        dataToUpdate.password = await bcrypt_1.default.hash(result.data.password, 10);
    }
    try {
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id },
            data: dataToUpdate,
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        return {
            success: true,
            data: updatedUser,
        };
    }
    catch (error) {
        if (error.code === 'P2002') {
            return {
                success: false,
                errors: {
                    email: ['Email already in use'],
                },
            };
        }
        throw error;
    }
}
function refreshAccessToken(token) {
    if (typeof token !== 'string') {
        return {
            success: false,
            error: 'Invalid token',
        };
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_REFRESH_SECRET);
        const accessToken = jsonwebtoken_1.default.sign({
            id: decoded.id,
        }, env_1.JWT_SECRET, { expiresIn: '15m' });
        return {
            success: true,
            data: {
                accessToken,
            },
        };
    }
    catch {
        return {
            success: false,
            error: 'Invalid or expired refresh token',
        };
    }
}
async function logout(refreshToken) {
    await prisma_1.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
    });
    return { success: true };
}
//# sourceMappingURL=user.services.js.map