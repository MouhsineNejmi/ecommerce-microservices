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
import { Category } from '../models/category';
import { deepMerge } from '../utils/deep-merge';
// import { Reservation } from '../models/reservations';

const router = express.Router();

export interface ListingQueryParams {
  page?: string | number;
  limit?: string | number;
  search?: string;
  status?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  city?: string;
  country?: string;
  baths?: string | number;
  bedrooms?: string | number;
  beds?: string | number;
  maxGuests?: string | number;
  startDate?: string | Date;
  endDate?: string | Date;
}

const buildFilterQuery = async (queryParams: ListingQueryParams) => {
  const filter: any = {};

  if (queryParams.status) {
    filter.status = queryParams.status;
  }

  if (queryParams.minPrice || queryParams.maxPrice) {
    filter['price.basePrice'] = {
      ...(queryParams.minPrice && { $gte: Number(queryParams.minPrice) }),
      ...(queryParams.maxPrice && { $lte: Number(queryParams.maxPrice) }),
    };
  }

  const numericFilters = [
    { key: 'baths', filterKey: 'baths' },
    { key: 'bedrooms', filterKey: 'bedrooms' },
    { key: 'beds', filterKey: 'beds' },
    { key: 'maxGuests', filterKey: 'maxGuests' },
  ];

  numericFilters.forEach(({ key, filterKey }) => {
    if (queryParams[key as keyof ListingQueryParams]) {
      filter[filterKey] = {
        $gte: Number(queryParams[key as keyof ListingQueryParams]),
      };
    }
  });

  if (queryParams.city) {
    filter['location.city'] = queryParams.city;
  }

  if (queryParams.country) {
    filter['location.country'] = queryParams.country;
  }

  if (queryParams.category) {
    const category = await Category.findOne({
      name: {
        $regex: new RegExp('^' + queryParams.category.toLowerCase(), 'i'),
      },
    });
    if (category) {
      filter.category = category._id;
    }
  }

  if (queryParams.search) {
    filter.$or = [
      { title: { $regex: new RegExp(queryParams.search as string, 'i') } },
      {
        description: { $regex: new RegExp(queryParams.search as string, 'i') },
      },
      {
        'location.city': {
          $regex: new RegExp(queryParams.search as string, 'i'),
        },
      },
      {
        'location.country': {
          $regex: new RegExp(queryParams.search as string, 'i'),
        },
      },
    ];
  }

  return filter;
};

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { limit = 10, page = 1 } = req.params;
    const filter = await buildFilterQuery(req.query);

    const listings = await Listing.find(filter)
      .limit(Number(filter.limit))
      .skip((Number(filter.page) - 1) * Number(filter.limit))
      .sort({ createdAt: -1 })
      .populate('amenities', 'icon name')
      .populate('category', 'id icon name');

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
    const { id: listingId } = req.params;
    const { id: userId, role } = req.user!;
    const { host, ...updateData } = req.body;

    let listing;

    if (role === 'admin') {
      listing = await Listing.findById(req.params.id, updateData);
    } else {
      listing = await Listing.findOneAndUpdate({
        id: listingId,
        host: userId,
      });
    }

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    const updatedListingData = deepMerge(listing.toObject(), updateData);

    listing = await Listing.findByIdAndUpdate(listingId, updatedListingData, {
      new: true,
    });

    return res.status(200).json({ data: listing });
  })
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id: listingId } = req.params;
    const { id: userId, role } = req.user!;

    let listing;

    if (role === 'admin') {
      listing = await Listing.findByIdAndDelete(listingId);
    } else {
      listing = await Listing.findOneAndDelete({
        id: listingId,
        host: userId,
      });
    }

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    return res.status(200).json({ message: 'Listing deleted successfully' });
  })
);

export default router;
