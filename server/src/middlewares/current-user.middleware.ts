import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import { UserRole } from '../types/user.types';

interface UserPayload {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && !authHeader.startsWith('Bearer ')) {
    next();
  }

  if (!req.cookies || !req.cookies.accessToken) {
    next();
  }

  try {
    const payload = jwt.verify(
      req.cookies.accessToken,
      config.jwt.accessToken.secret as string
    ) as UserPayload;
    req.user = payload;
  } catch (err) {}

  next();
};
