import express, { NextFunction, Request, Response } from 'express';
import {
  asyncHandler,
  validate,
  securityMiddleware,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} from '@elevatex/common';
import { User } from '../models/user';

import { Password } from '../services/password.service';
import { AuthService } from '../services/auth.service';

import { requireUser } from '../middlewares/require-user.middleware';

import {
  addressValidation,
  loginValidation,
  registerValidation,
} from '../validations/user.validation';
import { setTokenCookies } from '../utils/cookies';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('User Service');
});

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
    await AuthService.storeRefreshToken(user.id, tokens.refreshToken);

    setTokenCookies(res, tokens);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: tokens.accessToken,
    });
  })
);

router.post(
  '/login',
  loginValidation,
  securityMiddleware.loginLimiter,
  validate,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <{ email: string; password: string }>req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await Password.compare(user.password, password))) {
      throw new BadRequestError('Invalid Credentials');
    }

    const tokens = AuthService.generateTokens(user.id, user.role);
    await AuthService.storeRefreshToken(user.id, tokens.refreshToken);

    setTokenCookies(res, tokens);

    return res.json({
      accessToken: tokens.accessToken,
    });
  })
);

router.post(
  '/refresh-token',
  requireUser,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    const decoded = await AuthService.validateRefreshToken(refreshToken);
    if (!decoded) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const tokens = AuthService.generateTokens(decoded.userId, decoded.role);
    await AuthService.storeRefreshToken(decoded.userId, tokens.refreshToken);
    await AuthService.revokeRefreshToken(refreshToken);

    setTokenCookies(res, tokens);
  })
);

router.post(
  '/logout',
  requireUser,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await AuthService.revokeRefreshToken(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logout successful' });
  })
);

router.get('/me', requireUser, (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
});

router.post(
  '/addresses',
  requireUser,
  addressValidation,
  validate,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user!;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { addresses: req.body } },
      { new: true, runValidators: true }
    );

    return res.status(201).json(updatedUser?.addresses);
  })
);

export default router;
