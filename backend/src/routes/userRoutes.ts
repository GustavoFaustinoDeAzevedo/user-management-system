import { Router } from 'express';
import { register } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/register', register);

export { userRouter };
