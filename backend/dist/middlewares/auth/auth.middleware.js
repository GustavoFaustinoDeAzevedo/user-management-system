"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.authorize = authorize;
exports.onlyOwnerOrAdmin = onlyOwnerOrAdmin;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_utils_1 = require("./auth.utils");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
function authorize(roles) {
    return (req, res, next) => {
        const user = (0, auth_utils_1.getAuthUser)(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        return next();
    };
}
function onlyOwnerOrAdmin(param) {
    return (req, res, next) => {
        const user = req.user;
        const resourceId = Number(req.params[param]);
        if (user.role === 'admin' || user.id === resourceId) {
            return next();
        }
        return res.status(403).json({
            error: 'Forbidden',
        });
    };
}
function requireRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role !== role) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map