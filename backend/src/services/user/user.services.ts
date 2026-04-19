import {
  LoginResponse,
  PublicUser,
  RegisterResponse,
  User,
} from './user.types';
import { validateUser } from './user.validator';
import bcrypt from 'bcrypt';

let id = 1;

const users: User[] = [];

export async function createUser(input: unknown): Promise<RegisterResponse> {
  const result = validateUser(input);

  if (!result.success) {
    return result;
  }

  const { email } = result.data;
  const hashedPassword = await bcrypt.hash(result.data.password, 10);

  const user = {
    id: id++,
    email,
    password: hashedPassword,
  };
  users.push(user);

  return {
    success: true,
    data: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function loginUser(input: unknown): Promise<LoginResponse> {
  const result = validateUser(input);

  if (!result.success) {
    return result;
  }

  const user = users.find((u) => u.email === result.data.email);
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
    user.password,
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

  return {
    success: true,
    data: {
      id: user.id,
      email: user.email,
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
