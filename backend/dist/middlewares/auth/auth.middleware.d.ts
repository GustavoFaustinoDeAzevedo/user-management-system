import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.types';
import { Role } from '../../services/user/user.types';
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function authorize(roles: Role[]): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare function onlyOwnerOrAdmin(param: string): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare function requireRole(role: string): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map