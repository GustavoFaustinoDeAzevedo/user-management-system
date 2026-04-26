import type { Request, Response } from 'express';
import { ListUsersResponse, LoginResponse, RegisterResponse } from '../services/user/user.types';
export declare function register(req: Request, res: Response<RegisterResponse>): Promise<Response<RegisterResponse, Record<string, any>>>;
export declare function login(req: Request, res: Response<LoginResponse>): Promise<Response<LoginResponse, Record<string, any>>>;
export declare function listUsers(req: Request, res: Response<ListUsersResponse>): Promise<Response<ListUsersResponse, Record<string, any>>>;
export declare function updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function refreshTokenController(req: Request, res: Response): Response<any, Record<string, any>>;
//# sourceMappingURL=userController.d.ts.map