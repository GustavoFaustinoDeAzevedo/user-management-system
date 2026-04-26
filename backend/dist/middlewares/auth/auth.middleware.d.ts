import { Request, Response, NextFunction } from 'express';
import { Role } from '../../services/user/user.types';
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function authorize(roles: Role[]): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare function onlyOwnerOrAdmin(param: string): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.middleware.d.ts.map