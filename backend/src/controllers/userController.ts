import type { Request, Response } from 'express';

const users: { email: string }[] = [];

export function register(req: Request, res: Response) {
  const { email, password } = req.body;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  const userExists = users.find((user) => user.email === email);
  const errorMessages = {
    email: [
      { condition: userExists, message: 'User already exists' },
      {
        condition: !email || typeof email !== 'string' || !email.includes('@'),
        message: 'You must send a valid email address',
      },
    ],
    password: [
      { condition: !password, message: 'You must send a password' },
      {
        condition: password.length < 8 || password.length > 20,
        message: 'be at least 8 characters and at most 20',
      },
      {
        condition: regex.test(password) === false,
        message:
          'contain at least one special character, one number, one uppercase letter and one lowercase letter',
      },
    ],
  };

  // Validation
  const errors = {
    email: errorMessages.email
      .filter((error) => error.condition)
      .map((error) => error.message)
      .join(', ')
      .trim(),
    password: errorMessages.password
      .filter((error) => error.condition)
      .map((error) => error.message)
      .join(', ')
      .trim(),
  };

  if (errors.email !== '' && errors.password !== '') {
    return res.status(400).json({
      success: false,
      error: `${errors.email} and the ${errors.password !== '' ? 'password must ' + errors.password : ''}`,
    });
  }

  if (errors.email !== '' || errors.password !== '') {
    return res.status(400).json({
      success: false,
      error: `${errors.email}${errors.password !== '' ? 'Password must ' + errors.password : ''}`,
    });
  }

  // if (!email || typeof email !== 'string' || !email.includes('@')) {
  //   return res.status(400).json({ success: false, error: errorMessages[1] });
  // }
  // if (!password || typeof password !== 'string') {
  //   return res.status(400).json({
  //     success: false,
  //     error: errorMessages[2],
  //   });
  // }
  // if (password.length < 8 || password.length > 20) {
  //   return res.status(400).json({
  //     success: false,
  //     error: errorMessages[3],
  //   });
  // }
  // if (regex.test(password) === false) {
  //   return res.status(400).json({
  //     success: false,
  //     error: errorMessages[4],
  //   });
  // }

  // Create user

  const user = { email };
  users.push(user);
  return res.status(201).json({
    success: true,
    data: user,
  });
}

export function getUsers(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    data: users,
  });
}
