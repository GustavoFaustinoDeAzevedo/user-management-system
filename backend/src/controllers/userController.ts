import type { Request, Response } from 'express';
import {
  createUser,
  getUsers,
  loginUser,
  refreshAccessToken,
  updateUserById,
} from '../services/user/user.services';
import {
  ListUsersResponse,
  LoginResponse,
  RegisterResponse,
} from '../services/user/user.types';

export async function register(req: Request, res: Response<RegisterResponse>) {
  const result = await createUser(req.body);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
}

export async function login(req: Request, res: Response<LoginResponse>) {
  const result = await loginUser(req.body);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}

export async function listUsers(req: Request, res: Response<ListUsersResponse>) {
  const users = await getUsers();


  return res.status(200).json({
    success: true,
    data: users,
  });
}

export async function updateUser(req: Request, res: Response) {
  const userId = Number(req.params.id);

  const result = await updateUserById(userId, req.body);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
}

export function refreshTokenController(req: Request, res: Response) {
  const { refreshToken } = req.body;

  const result = refreshAccessToken(refreshToken);

  if (!result.success) {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
}
