import { Router } from 'express';
import {
  listUsers,
  login,
  logoutController,
  refresh,
  refreshTokenController,
  register,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import {
  authMiddleware,
  authorize,
  onlyOwnerOrAdmin,
  requireRole,
} from '../middlewares/auth/auth.middleware';

const userRouter = Router();

userRouter.post('/register', register);

userRouter.post('/login', login);

userRouter.post('/refresh', refreshTokenController);

userRouter.get('/', authMiddleware, requireRole('admin'), listUsers);

userRouter.patch('/:id', authMiddleware, onlyOwnerOrAdmin('id'), updateUser);

userRouter.delete('/:id', authMiddleware, deleteUser);

userRouter.post('/refresh', refresh);

userRouter.post('/logout', logoutController);

export { userRouter };
