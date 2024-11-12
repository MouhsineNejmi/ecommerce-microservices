import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { User, UserDocument } from '../models/user';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { BadRequestError } from '../errors/bad-request.error';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export const requireUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('You are not logged in!');
  }

  try {
    const decoded = verify(token, process.env.ELEVATEX_JWT_KEY!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new UnauthorizedError('Invalid user');
    }

    req.user = user;

    next();
  } catch (err) {
    if (err instanceof Error && err.message) {
      throw new UnauthorizedError(err.message);
    }

    throw new BadRequestError('Something went wrong');
  }
};
