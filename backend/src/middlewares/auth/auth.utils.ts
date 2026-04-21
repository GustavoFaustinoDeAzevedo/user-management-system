import { Request } from 'express';
import { AuthUser } from './auth.types';

export function getAuthUser(req: Request): AuthUser {
  return (req as Request & { user: AuthUser }).user;
}