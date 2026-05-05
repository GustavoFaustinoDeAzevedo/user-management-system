"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.listUsers = listUsers;
exports.updateUser = updateUser;
exports.refreshTokenController = refreshTokenController;
exports.refresh = refresh;
exports.logoutController = logoutController;
const user_services_1 = require("../services/user/user.services");
const prisma_1 = require("../lib/prisma/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function register(req, res) {
    const result = await (0, user_services_1.createUser)(req.body);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(201).json(result);
}
async function login(req, res) {
    console.log('BACKEND cwd:', process.cwd());
    console.log('BACKEND DATABASE_URL:', process.env.DATABASE_URL);
    console.log('BODY recebido no login:', req.body);
    const result = await (0, user_services_1.loginUser)(req.body);
    console.log('Resultado do loginUser:', result);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(200).json(result);
}
async function listUsers(req, res) {
    const users = await (0, user_services_1.getUsers)();
    return res.status(200).json({
        success: true,
        data: users,
    });
}
async function updateUser(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const userIdFromToken = req.user.id;
    const userIdFromParams = Number(req.params.id);
    if (userIdFromToken !== userIdFromParams) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await (0, user_services_1.updateUserById)(userIdFromParams, req.body);
    return res.json(result);
}
function refreshTokenController(req, res) {
    const { refreshToken } = req.body;
    const result = (0, user_services_1.refreshAccessToken)(refreshToken);
    if (!result.success) {
        return res.status(401).json(result);
    }
    return res.status(200).json(result);
}
async function refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const tokenInDb = await prisma_1.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!tokenInDb) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });
        return res.json({ accessToken });
    }
    catch {
        return res.status(403).json({ error: 'Invalid token' });
    }
}
async function logoutController(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Token required' });
    }
    await (0, user_services_1.logout)(refreshToken);
    return res.json({ success: true });
}
//# sourceMappingURL=userController.js.map