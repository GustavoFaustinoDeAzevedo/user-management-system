import { Router } from 'express';
import { listUsers, login, register } from '../controllers/userController';
import { authMiddleware, authorize } from '../middlewares/auth/auth.middleware';

const userRouter = Router();

userRouter.post('/register', register);

userRouter.post('/login', login);

userRouter.get('/', authMiddleware, authorize(['admin','moderator']), listUsers);

export { userRouter };
