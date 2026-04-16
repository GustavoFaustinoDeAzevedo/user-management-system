import type { Request, Response } from 'express';

const users = [];

export function register(req: Request, res: Response) {
  const { email, password } = req.body;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res
      .status(400)
      .json({ success: false, error: 'You must send a valid email' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'You must send a valid password',
    });
  }
  if (password.length < 8 || password.length > 20) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters and at most 20',
    });
  }
  if (regex.test(password) === false) {
    return res.status(400).json({
      success: false,
      error:
        'Password must contain at least one special character, one number, one uppercase letter and one lowercase letter',
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      email,
    },
  });
}
