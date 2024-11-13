import express, { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';

import { generateToken } from '../services/jwt';
import { Password } from '../services/password';

import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { validate } from '../middlewares/validator.middleware';
import {
  addressValidation,
  loginValidation,
  registerValidation,
} from '../validations/user.validation';

import { ConflictError } from '../errors/conflict.error';
import { requireUser } from '../middlewares/require-user.middleware';
import { NotFoundError } from '../errors/not-found.error';
import { BadRequestError } from '../errors/bad-request.error';

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

    const token = generateToken(user.id);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  })
);

router.post(
  '/login',
  loginValidation,
  validate,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <{ email: string; password: string }>req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await Password.compare(user.password, password))) {
      throw new BadRequestError('Invalid Credentials');
    }

    const token = generateToken(user.id);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  })
);

router.post(
  '/refresh-token',
  requireUser,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user!;

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found!');
    }

    const token = generateToken(user.id);

    res.json({ token });
  })
);

router.post(
  '/logout',
  requireUser,
  (req: Request, res: Response, next: NextFunction) => {
    // To do: Improve auth system and logout
    res.json({ message: 'Logged out successfully' });
  }
);

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
