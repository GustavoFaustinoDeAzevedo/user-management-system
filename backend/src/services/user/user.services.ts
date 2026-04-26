import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../../config/env';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma/prisma';
import {
  LoginResponse,
  PublicUser,
  RegisterResponse,
  User,
} from './user.types';
import {
  validateUpdateUser,
  validateUser,
  validateUserBase,
} from './user.validator';

export async function createUser(input: unknown): Promise<RegisterResponse> {
  const result = validateUser(input);

  if (!result.success) {
    return result;
  }

  const email = result.data.email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(result.data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'user',
      },
    });

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      } as PublicUser,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        errors: {
          email: ['Email already in use'],
          password: [],
        },
      };
    }

    throw error;
  }
}

export async function loginUser(input: unknown): Promise<LoginResponse> {
  const result = validateUserBase(input);

  if (!result.success) {
    return result;
  }

  const email = result.data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email },
  });

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

  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets not defined');
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' },
  );

  return {
    success: true,
    data: {
      accessToken,
      refreshToken,
    },
  };
}

export async function getUsers(): Promise<PublicUser[]> {
  const users = (await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
    },
  })) as PublicUser[];

  return users;
}

export async function updateUserById(id: number, input: unknown) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return { success: false, error: 'User not found' };
  }

  const result = validateUpdateUser(input);

  if (!result.success) {
    return result;
  }

  const dataToUpdate: any = {};

  if (result.data.email !== undefined) {
    dataToUpdate.email = result.data.email.toLowerCase().trim();
  }

  if (result.data.password !== undefined) {
    dataToUpdate.password = await bcrypt.hash(result.data.password, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return {
        success: false,
        errors: {
          email: ['Email already in use'],
        },
      };
    }

    throw error;
  }
}

export function refreshAccessToken(token: unknown) {
  if (typeof token !== 'string') {
    return {
      success: false,
      error: 'Invalid token',
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;

    const accessToken = jwt.sign(
      {
        id: decoded.id,
      },
      JWT_SECRET,
      { expiresIn: '15m' },
    );

    return {
      success: true,
      data: {
        accessToken,
      },
    };
  } catch {
    return {
      success: false,
      error: 'Invalid or expired refresh token',
    };
  }
}
