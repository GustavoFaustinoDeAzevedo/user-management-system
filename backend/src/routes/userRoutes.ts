import { Router } from 'express';
import { getUsers, register } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/register', register);

userRouter.get('/', getUsers);

export { userRouter };
