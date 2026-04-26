"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.listUsers = listUsers;
exports.updateUser = updateUser;
exports.refreshTokenController = refreshTokenController;
const user_services_1 = require("../services/user/user.services");
async function register(req, res) {
    const result = await (0, user_services_1.createUser)(req.body);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(201).json(result);
}
async function login(req, res) {
    const result = await (0, user_services_1.loginUser)(req.body);
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
    const userId = Number(req.params.id);
    const result = await (0, user_services_1.updateUserById)(userId, req.body);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(200).json(result);
}
function refreshTokenController(req, res) {
    const { refreshToken } = req.body;
    const result = (0, user_services_1.refreshAccessToken)(refreshToken);
    if (!result.success) {
        return res.status(401).json(result);
    }
    return res.status(200).json(result);
}
//# sourceMappingURL=userController.js.map