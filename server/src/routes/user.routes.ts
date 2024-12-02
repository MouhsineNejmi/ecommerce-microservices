import express, { NextFunction, Request, Response } from 'express';

import { validate } from '../middlewares/validator.middleware';
import { currentUser } from '../middlewares/current-user.middleware';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { securityMiddleware } from '../middlewares/security.middleware';
import { ConflictError, BadRequestError, UnauthorizedError } from '../errors';

import { Password } from '../services/password.service';
import { AuthService } from '../services/auth.service';

import { asyncHandler } from '../utils/async-handler';
import { setTokenCookies } from '../utils/cookies';

import { User } from '../models/user';

import {
  loginValidation,
  registerValidation,
} from '../validations/user.validation';

const router = express.Router();

router.post(
  '/register',
  registerValidation,
  validate,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email }).select('-password');
    if (userExists) {
      throw new ConflictError('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const tokens = AuthService.generateTokens(user.id, user.role);

    setTokenCookies(res, tokens);

    return res.status(201).json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: tokens.accessToken,
      },
    });
  })
);

router.post(
  '/login',
  loginValidation,
  validate,
  securityMiddleware.loginLimiter,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <{ email: string; password: string }>req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await Password.compare(user.password, password))) {
      throw new BadRequestError('Invalid Credentials');
    }

    const tokens = AuthService.generateTokens(user.id, user.role);

    setTokenCookies(res, tokens);

    return res.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: tokens.accessToken,
      },
    });
  })
);

router.use(currentUser);

router.post(
  '/refresh-token',
  requireAuth,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    const decoded = await AuthService.validateRefreshToken(refreshToken);
    if (!decoded) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const tokens = AuthService.generateTokens(decoded.id, decoded.role);

    setTokenCookies(res, tokens);

    return res.json({
      data: {
        accessToken: tokens.accessToken,
      },
    });
  })
);

router.post(
  '/logout',
  requireAuth,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logout successful' });
  })
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id).select('-password');

    return res.json({ data: user });
  })
);

export default router;
