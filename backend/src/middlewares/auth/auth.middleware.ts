import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthUser } from './auth.types';
import { Role } from '../../services/user/user.types';
import { getAuthUser } from './auth.utils';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const token = authHeader.split(' ')[1] as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;

    (req as Request & { user: AuthUser }).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function authorize(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getAuthUser(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return next();
  };
}

export function onlyOwnerOrAdmin(param: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Request & { user: AuthUser }).user;
    const resourceId = Number(req.params[param]);

    if (user.role === 'admin' || user.id === resourceId) {
      return next();
    }

    return res.status(403).json({
      error: 'Forbidden',
    });
  };
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}
