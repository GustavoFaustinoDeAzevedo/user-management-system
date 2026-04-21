import { Router } from 'express';
import {
  listUsers,
  login,
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

userRouter.get(
  '/',
  authMiddleware,
  authorize(['admin', 'moderator', 'user']),
  listUsers,
);

userRouter.put('/:id', authMiddleware, onlyOwnerOrAdmin('id'), updateUser);

export { userRouter };
