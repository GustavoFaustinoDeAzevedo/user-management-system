import { Router } from 'express';
import {
  listUsers,
  login,
  refreshTokenController,
  register,
  updateUser,
} from '../controllers/userController';
import {
  authMiddleware,
  authorize,
  onlyOwnerOrAdmin,
} from '../middlewares/auth/auth.middleware';

const userRouter = Router();

userRouter.post('/register', register);

userRouter.post('/login', login);

userRouter.post('/refresh', refreshTokenController);

userRouter.get(
  '/',
  authMiddleware,
  authorize(['admin', 'moderator', 'user']),
  listUsers,
);

userRouter.patch('/:id', authMiddleware, onlyOwnerOrAdmin('id'), updateUser);

export { userRouter };
