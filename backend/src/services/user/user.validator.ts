import { ValidationResult } from './user.types';

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

const emailValidation = {
  testIfString: (email: unknown): email is string => typeof email === 'string',
  testIfValid: (email: string) => email.includes('@'),
};

const passwordValidation = {
  testIfString: (password: unknown): password is string =>
    typeof password === 'string',
  testIfValid: (password: string) => regex.test(password),
  testIfLength: (password: string) =>
    password.length >= 8 && password.length <= 20,
  testIfEmptyConfirmPassword: (confirmPassword: string) =>
    confirmPassword.trim() === '',
  testIfMatch: (password: string, confirmPassword: string) =>
    password === confirmPassword,
};

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
  const email = (data as any).email;
  const password = (data as any).password;

  emailValidation.testIfString(email) ||
    errors.email.push('You must send an email address');

  passwordValidation.testIfString(password) ||
    errors.password.push('You must send a password');

  if (errors.email.length || errors.password.length) {
    return { success: false, errors };
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
  
  // Validações adicionais para o password

  const errors = [] as string[];

  const email = (result.data as any).email;
  const password = (result.data as any).password;

  passwordValidation.testIfLength(password) ||
    errors.push('Password must be between 8 and 20 characters');

  passwordValidation.testIfValid(password) ||
    errors.push(
      'Password must contain uppercase, lowercase, number and special character',
    );

  if (errors.length) {
    return { success: false, errors: { email: [], password: errors } };
  }

  return {
    success: true,
    data: { email, password },
  };
}

export function validateUpdateUser(data: unknown): ValidationResult {
  const errors = {
    email: [] as string[],
    password: [] as string[],
  };

  if (typeof data !== 'object' || data === null) {
    return {
      success: false,
      errors: {
        email: ['Invalid payload'],
        password: ['Invalid payload'],
      },
    };
  }

  const { email, password } = data as any;

  if (email !== undefined) {
    const isValidEmail =
      emailValidation.testIfString(email) && emailValidation.testIfValid(email);

    if (!isValidEmail) errors.email.push('Invalid email');
  }

  if (password !== undefined) {
    const isStringPassword = passwordValidation.testIfString(password);

    if (!isStringPassword) {
      errors.password.push('Invalid password');
    } else {
      const isLengthValid = passwordValidation.testIfLength(password);
      const hasValidChars = passwordValidation.testIfValid(password);

      if (!isLengthValid) {
        errors.password.push('Password must be between 8 and 20 characters');
      }
      if (!hasValidChars) {
        errors.password.push(
          'Password must contain uppercase, lowercase, number and special character',
        );
      }
    }
  }

  if (errors.email.length || errors.password.length) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email,
      password,
    },
  };
}
