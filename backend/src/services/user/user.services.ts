import {
  LoginResponse,
  PublicUser,
  RegisterResponse,
  User,
} from './user.types';
import { validateUser, validateUserBase } from './user.validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let id = 1;

const users: User[] = [];

export async function createUser(input: unknown): Promise<RegisterResponse> {
  const lowerCaseEmail = (input as any).email.toLowerCase().trim();
  if (users?.find((u) => u.email === lowerCaseEmail)) {
    return {
      success: false,
      errors: {
        email: ['Email already in use'],
      },
    };
  }
  const result = validateUser(input);

  if (!result.success) {
    return result;
  }

  const email = result.data.email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(result.data.password, 10);

  const user: User = {
    id: id++,
    email,
    password: hashedPassword,
    role: 'user',
  };
  users.push(user);

  return {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

export async function loginUser(input: unknown): Promise<LoginResponse> {
  const result = validateUserBase(input);

  if (!result.success) {
    return result;
  }

  const email = result.data.email.toLowerCase().trim();

  const user = users.find((u) => u.email === email);
  if (!user) {
    return {
      success: false,
      errors: {
        email: ['Invalid credentials'],
        password: [],
      },
    };
  }

  const passwordMatch = await bcrypt.compare(
    result.data.password,
    user.password
  );
  if (!passwordMatch) {
    return {
      success: false,
      errors: {
        email: ['Invalid credentials'],
        password: [],
      },
    };
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h',
    },
  );

  return {
    success: true,
    data: {
      token,
    },
  };
}

export function getUsers(): User[] {
  return users;
}

export function toPublicUser(user: User): PublicUser {
  const { password, ...rest } = user;
  return rest;
}

export function updateUserById(id: number, data: any) {
  const user = users.find((u) => u.id === id);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (data.email) user.email = data.email;

  return {
    success: true,
    data: toPublicUser(user),
  };
}
