import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import { asyncHandler } from '../utils/async-handler';
import { Amenity } from '../models/amenity';
import {
  createCategoryAmenity,
  updateCategoryAmenity,
} from '../validations/category-amenity.validation';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { requireAdmin } from '../middlewares/require-admin.middleware';
import { validate } from '../middlewares/validator.middleware';
import { currentUser } from '../middlewares/current-user.middleware';
import { ConflictError, NotFoundError } from '../errors';

const router = Router();

router.use(currentUser);

router.get(
  '/',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    const searchQuery = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    const sortOptions: { [key: string]: mongoose.SortOrder } = {
      [sortBy as string]: sortOrder === 'asc' ? 1 : -1,
    };

    const amenities = await Amenity.find(searchQuery)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Amenity.countDocuments(searchQuery);

    return res.json({
      data: amenities,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(Number(total) / Number(limit)),
        total,
      },
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const amenity = await Amenity.findById(req.params.id);

    if (!amenity) {
      throw new NotFoundError('Amenity not found');
    }

    return res.json({ data: amenity });
  })
);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  createCategoryAmenity,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { name, icon } = req.body;

    const existingAmenity = await Amenity.findOne({ name });

    if (existingAmenity) {
      throw new ConflictError('Amenity already exists');
    }

    const amenity = Amenity.build({
      name,
      icon,
    });
    await amenity.save();

    return res.status(201).json({
      data: amenity,
    });
  })
);

router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  updateCategoryAmenity,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const amenity = await Amenity.findById(req.params.id);

    if (!amenity) {
      throw new NotFoundError('Amenity not found');
    }

    const { name, icon } = req.body;

    Object.keys({ name, icon }).forEach((key) => {
      amenity.set(key, req.body[key]);
    });

    await amenity.save();

    return res.status(200).json({ data: amenity });
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const amenity = await Amenity.findByIdAndDelete(req.params.id);

    if (!amenity) {
      throw new NotFoundError('Amenity not found');
    }

    return res.status(200).json({
      message: 'Amenity deleted successfully',
    });
  })
);

export default router;
