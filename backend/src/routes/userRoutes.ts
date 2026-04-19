import { Router } from 'express';
import { listUsers, login, register } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/register', register);

userRouter.post('/login', login);

userRouter.get('/list', listUsers);

userRouter.get('/', listUsers);

export { userRouter };
