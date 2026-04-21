import type { Request, Response } from 'express';
import {
  createUser,
  getUsers,
  loginUser,
  toPublicUser,
  updateUserById,
} from '../services/user/user.services';
import {
  ListUsersResponse,
  LoginResponse,
  RegisterResponse,
} from '../services/user/user.types';
import { getAuthUser } from '../middlewares/auth/auth.utils';

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

export function listUsers(req: Request, res: Response<ListUsersResponse>) {
  const users = getUsers();

  const safeUsers = users.map(toPublicUser);

  return res.status(200).json({
    success: true,
    data: safeUsers,
  });
}

export function updateUser(req: Request, res: Response) {
  const targetUserId = Number(req.params.id);

  const result = updateUserById(targetUserId, req.body);

  return res.status(200).json(result);
}
