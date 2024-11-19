import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { asyncHandler, UnauthorizedError } from '@elevatex/common';

import { User, UserDocument } from '../models/user';

import { AuthService } from '../services/auth.service';
import config from '../config';
import { JWTPayload } from '../types/jwt.types';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export const requireUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = AuthService.extractToken(req);

    if (!token) {
      throw new UnauthorizedError('You are not logged in!');
    }

    const decoded = verify(
      token,
      config.jwt.accessToken.secret as string
    ) as JWTPayload;

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;

    next();
  }
);
