import express, { NextFunction, Request, Response } from 'express';

import { validate } from '../middlewares/validator.middleware';
import { currentUser } from '../middlewares/current-user.middleware';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { securityMiddleware } from '../middlewares/security.middleware';
import {
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../errors';

import { Password } from '../services/password.service';
import { AuthService } from '../services/auth.service';

import { asyncHandler } from '../utils/async-handler';
import { setTokenCookies } from '../utils/cookies';

import { User } from '../models/user';

import {
  loginValidation,
  registerValidation,
} from '../validations/user.validation';
import { Listing } from '../models/listings';

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

router.put(
  '/profile',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { name, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
      {
        new: true,
        select: 'id name avatar',
      }
    );

    return res.json({ data: updatedUser });
  })
);

router.get(
  '/favorites',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const user = await User.findById(userId).populate('favorites');

    return res.json({ data: user?.favorites || [] });
  })
);

router.post(
  '/favorites/:listingId',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { listingId } = req.params;

    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    if (!user.favorites?.includes(listing.id)) {
      user?.favorites?.push(listing.id);
      await user.save();
    }

    return res.json({ data: user?.favorites || [] });
  })
);

router.delete(
  '/favorites/:listingId',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { listingId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.favorites = user.favorites?.filter(
      (id) => id.toString() !== listingId
    );

    await user.save();

    return res.json({ data: user?.favorites || [] });
  })
);

export default router;
