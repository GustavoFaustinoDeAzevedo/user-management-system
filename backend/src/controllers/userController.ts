import type { Request, Response } from 'express';
import {
  createUser,
  getUsers,
  loginUser,
  toPublicUser,
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

export function listUsers(req: Request, res: Response<ListUsersResponse>) {
  const users = getUsers();

  const safeUsers = users.map(toPublicUser);

  return res.status(200).json({
    success: true,
    data: safeUsers,
  });
}
