import type { Request, Response } from 'express';
import { createUser, getUsers } from '../services/user/user.services';
import {
  ListUsersResponse,
  RegisterResponse,
  User,
} from '../services/user/user.types';

export function register(req: Request, res: Response<RegisterResponse>) {
  const result = createUser(req.body);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
}

export function listUsers(req: Request, res: Response<ListUsersResponse>) {
  const users: User[] = getUsers();
  return res.status(200).json({
    success: true,
    data: users,
  });
}
