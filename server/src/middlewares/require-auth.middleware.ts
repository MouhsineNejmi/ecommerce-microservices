import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new UnauthorizedError('Not authenticated');
  }

  next();
};
