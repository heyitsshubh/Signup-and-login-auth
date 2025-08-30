import { Request, Response, NextFunction } from 'express';

export function validateSignup(req: Request, res: Response, next: NextFunction) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return next({ status: 400, message: 'Email, password, and name are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next({ status: 400, message: 'Invalid email format.' });
  }
  if (password.length < 6) {
    return next({ status: 400, message: 'Password must be at least 6 characters.' });
  }
  next();
}
