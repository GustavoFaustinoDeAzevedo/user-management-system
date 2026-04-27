"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_middleware_1 = require("../middlewares/auth/auth.middleware");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.post('/register', userController_1.register);
userRouter.post('/login', userController_1.login);
userRouter.post('/refresh', userController_1.refreshTokenController);
userRouter.get('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.requireRole)('admin'), userController_1.listUsers);
userRouter.post('/refresh', userController_1.refresh);
userRouter.post('/logout', userController_1.logoutController);
userRouter.patch('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.onlyOwnerOrAdmin)('id'), userController_1.updateUser);
//# sourceMappingURL=userRoutes.js.map