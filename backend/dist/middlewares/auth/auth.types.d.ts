import { Request } from 'express';
import { Role } from '../../services/user/user.types';
export type AuthUser = {
    id: number;
    email: string;
    role: Role;
};
export type AuthRequest = Request & {
    user: AuthUser;
};
//# sourceMappingURL=auth.types.d.ts.map