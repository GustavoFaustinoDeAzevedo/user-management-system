import type { Request, Response } from 'express';
import {
  createUser,
  getUsers,
  loginUser,
  logout,
  refreshAccessToken,
  updateUserById,
} from '../services/user/user.services';
import {
  ListUsersResponse,
  LoginResponse,
  RegisterResponse,
} from '../services/user/user.types';
import { prisma } from '../lib/prisma/prisma';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/auth/auth.types';

export async function register(req: Request, res: Response<RegisterResponse>) {
  const result = await createUser(req.body);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
}

export async function login(req: Request, res: Response<LoginResponse>) {
  console.log('BACKEND cwd:', process.cwd());
  console.log('BACKEND DATABASE_URL:', process.env.DATABASE_URL);
  console.log('BODY recebido no login:', req.body);

  const result = await loginUser(req.body);

  console.log('Resultado do loginUser:', result);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}

export async function listUsers(
  req: Request,
  res: Response<ListUsersResponse>,
) {
  const users = await getUsers();

  return res.status(200).json({
    success: true,
    data: users,
  });
}

export async function updateUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userIdFromToken = req.user.id;
  const userIdFromParams = Number(req.params.id);

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const result = await updateUserById(userIdFromParams, req.body);

  return res.json(result);
}

export function refreshTokenController(req: Request, res: Response) {
  const { refreshToken } = req.body;

  const result = refreshAccessToken(refreshToken);

  if (!result.success) {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as any;

    const tokenInDb = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenInDb) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });

    return res.json({ accessToken });
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

export async function logoutController(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Token required' });
  }

  await logout(refreshToken);

  return res.json({ success: true });
}
