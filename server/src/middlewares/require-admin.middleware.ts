import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    throw new UnauthorizedError('Not authorized');
  }

  next();
};
