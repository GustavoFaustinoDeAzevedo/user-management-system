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
    password: string[];
  };
};

export type ListUsersResponse = {
  success: true;
  data: User[];
};

export type RegisterResponse =
  | {
      success: true;
      data: User;
    }
  | ErrorResponse;

export type User = {
  id: number;
  email: string;
};
