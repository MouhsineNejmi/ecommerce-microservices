import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import { asyncHandler } from '../utils/async-handler';
import { Category } from '../models/category';
import {
  createCategoryAmenity,
  updateCategoryAmenity,
} from '../validations/category-amenity.validation';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { requireAdmin } from '../middlewares/require-admin.middleware';
import { validate } from '../middlewares/validator.middleware';
import { ConflictError, NotFoundError } from '../errors';

const router = Router();

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

    const categories = await Category.find(searchQuery)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Category.countDocuments(searchQuery);

    return res.json({
      data: categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(Number(total) / Number(limit)),
        totalItems: total,
      },
    });
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

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new ConflictError('Category already exists');
    }

    const category = Category.build({
      name,
      icon,
    });
    await category.save();

    return res.status(201).json({
      data: category,
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
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const { name, icon } = req.body;

    Object.keys({ name, icon }).forEach((key) => {
      category.set(key, req.body[key]);
    });

    await category.save();

    return res.status(200).json({ data: category });
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findOneAndDelete({ id: req.params.id });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return res.status(200).json({
      message: 'Category deleted successfully',
    });
  })
);

export default router;
