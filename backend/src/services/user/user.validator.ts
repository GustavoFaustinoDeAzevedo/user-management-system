import { User, ValidationResult } from './user.types';

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export function validateUserBase(data: unknown): ValidationResult {
  if (typeof data !== 'object' || data === null) {
    return {
      success: false,
      errors: {
        email: ['Invalid payload'],
        password: ['Invalid payload'],
      },
    };
  }

  const errors = {
    email: [] as string[],
    password: [] as string[],
  };
  const rawEmail = (data as any).email;
  const rawPassword = (data as any).password;
  let email: string | undefined;
  let password: string | undefined;

  // Email
  if (typeof rawEmail !== 'string' || !rawEmail.includes('@')) {
    errors.email.push('You must send a valid email address');
  } else {
    email = rawEmail;
  }

  // Password
  if (typeof rawPassword !== 'string') {
    errors.password.push('You must send a password');
  } else {
    password = rawPassword;
  }

  if (errors.email.length || errors.password.length) {
    return { success: false, errors };
  }

  if (!email || !password) {
    throw new Error('Validation logic failed'); // nunca deve acontecer
  }

  return {
    success: true,
    data: { email, password },
  };
}

export function validateUser(data: unknown): ValidationResult {


  // Reutiliza as validações básicas de email e password
  const result = validateUserBase(data);

  if (!result.success) {
    return result;
  }
  // Validações adicionais para registro
  const errors = {
    email: [] as string[],
    password: [] as string[],
  };
  const email = (result.data as any).email;
  const password = (result.data as any).password;

  if (password.length < 8 || password.length > 20) {
    errors.password.push('Password must be between 8 and 20 characters');
  }

  if (!regex.test(password)) {
    errors.password.push(
      'Password must contain uppercase, lowercase, number and special character',
    );
  }

  if (errors.email.length || errors.password.length) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { email, password },
  };
}
