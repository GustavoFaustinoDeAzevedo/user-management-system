export type Role = 'user' | 'moderator' | 'admin';

export type User = {
  id: number;
  email: string;
  password: string;
  role: Role;
};

export type PublicUser = Omit<User, 'password'>;

export type ValidUserData = {
  email: string;
  password: string;
};

export type ValidationResult =
  | { success: true; data: ValidUserData }
  | {
      success: false;
      errors: {
        email: string[];
        password: string[];
      };
    };

export type ErrorResponse = {
  success: false;
  errors: {
    email: string[];
    password?: string[];
  };
};

export type ListUsersResponse = {
  success: true;
  data: PublicUser[];
};

export type RegisterResponse =
  | {
      success: true;
      data: PublicUser;
    }
  | ErrorResponse;

export type LoginResponse =
  | {
      success: true;
      data: { token: string };
    }
  | ErrorResponse;
