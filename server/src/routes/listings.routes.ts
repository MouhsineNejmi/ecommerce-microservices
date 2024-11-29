import express, { Request, Response } from 'express';
import { Listing, ListingAttrs } from '../models/listings';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { validate } from '../middlewares/validator.middleware';
import { currentUser } from '../middlewares/current-user.middleware';

import { NotFoundError, UnauthorizedError } from '../errors';

import {
  createListingValidation,
  updateListingValidation,
} from '../validations/listing.validation';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      minPrice,
      maxPrice,
      city,
      country,
    } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter['price.basePrice'] = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }
    if (city) filter['location.city'] = city;
    if (country) filter['location.country'] = country;

    const listings = await Listing.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })
      .populate('amenities', 'icon name')
      .populate('category', 'name');

    const total = await Listing.countDocuments(filter);

    return res.status(200).json({
      data: listings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const listing = await Listing.findById(req.params.id)
      .populate('amenities', 'icon name')
      .populate('category', 'name');

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    return res.status(200).json({ data: listing });
  })
);

router.use(currentUser);

router.post(
  '/',
  requireAuth,
  createListingValidation,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const listingData: ListingAttrs = {
      ...req.body,
      host: req.user!.id,
      status: 'draft',
    };

    const listing = Listing.build(listingData);
    await listing.save();

    return res.status(201).json({ data: listing });
  })
);

router.put(
  '/:id',
  requireAuth,
  updateListingValidation,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    if (listing.host.toString() !== req.user!.id) {
      throw new UnauthorizedError('Not authorized to update this listing');
    }

    const { host, ...updateData } = req.body;

    Object.keys(updateData).forEach((key) => {
      listing.set(key, updateData[key]);
    });

    await listing.save();

    return res.status(200).json({ data: listing });
  })
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const listing = await Listing.findOneAndDelete({
      id: req.params.id,
      host: req.user!.id,
    });

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    return res.status(200).json({ message: 'Listing deleted successfully' });
  })
);

export default router;
