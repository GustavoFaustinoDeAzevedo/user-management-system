import { Router } from 'express';
import { listUsers, register } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/register', register);

userRouter.get('/', listUsers);

export { userRouter };
