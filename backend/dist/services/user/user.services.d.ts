import { LoginResponse, PublicUser, RegisterResponse } from './user.types';
export declare function createUser(input: unknown): Promise<RegisterResponse>;
export declare function loginUser(input: unknown): Promise<LoginResponse>;
export declare function getUsers(): Promise<PublicUser[]>;
export declare function updateUserById(id: number, input: unknown): Promise<{
    success: false;
    errors: {
        email: string[];
        password: string[];
    };
} | {
    success: boolean;
    error: string;
    data?: never;
    errors?: never;
} | {
    success: boolean;
    data: {
        id: number;
        email: string;
        role: string;
    };
    error?: never;
    errors?: never;
} | {
    success: boolean;
    errors: {
        email: string[];
    };
    error?: never;
    data?: never;
}>;
export declare function refreshAccessToken(token: unknown): {
    success: boolean;
    error: string;
    data?: never;
} | {
    success: boolean;
    data: {
        accessToken: string;
    };
    error?: never;
};
//# sourceMappingURL=user.services.d.ts.map