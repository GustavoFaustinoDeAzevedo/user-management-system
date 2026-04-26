import 'dotenv/config';
import { prisma } from './lib/prisma/prisma';
import type { Request, Response } from 'express';
import { userRouter } from './routes/userRoutes';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/users', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor rodando');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// async function testDatabase() {
//   const user = await prisma.user.create({
//     data: {
//       email: 'teste@email.com',
//       password: '12345678',
//     },
//   });

//   console.log('User criado:', user);
// }

// testDatabase();
