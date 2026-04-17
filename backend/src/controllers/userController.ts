import type { Request, Response } from 'express';

let id = 1;

type User = {
  id: number;
  email: string;
};

type ErrorResponse = {
  success: false;
  errors: {
    email: string[];
    password: string[];
  };
};

type RegisterResponse =
  | {
      success: boolean;
      data: User | User[];
    }
  | ErrorResponse;

const users: User[] = [];

export function register(req: Request, res: Response<RegisterResponse>) {
  const { email, password } = req.body;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  const isValidEmail =
    email && typeof email === 'string' && email.includes('@');
  const isPasswordFilled = password && typeof password === 'string';
  const errorMessages = {
    email: [
      {
        condition: !isValidEmail,
        message: 'You must send a valid email address',
      },
      {
        condition: isValidEmail && users.some((user) => user.email === email),
        message: 'User already exists',
      },
    ],
    password: [
      { condition: !isPasswordFilled, message: 'You must send a password' },
      {
        condition:
          isPasswordFilled && (password.length < 8 || password.length > 20),
        message: 'Password must be at least 8 characters and at most 20',
      },
      {
        condition: isPasswordFilled && regex.test(password) === false,
        message:
          'Password must contain at least one special character, one number, one uppercase letter and one lowercase letter',
      },
    ],
  };

  // Validation

  const errors = {
    email: errorMessages.email
      .filter((error) => error.condition)
      .map((error) => error.message),
    password: errorMessages.password
      .filter((error) => error.condition)
      .map((error) => error.message),
  };

  if (errors.email.length > 0 || errors.password.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
    });
  }

  // Create user

  const user = { id: id++, email };
  users.push(user);
  return res.status(201).json({
    success: true,
    data: user,
  });
}

export function getUsers(req: Request, res: Response<RegisterResponse>) {
  return res.status(200).json({
    success: true,
    data: users,
  });
}
