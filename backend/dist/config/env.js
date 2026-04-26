"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = void 0;
function getEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is required`);
    }
    return value;
}
exports.JWT_SECRET = getEnv('JWT_SECRET');
exports.JWT_REFRESH_SECRET = getEnv('JWT_REFRESH_SECRET');
//# sourceMappingURL=env.js.map