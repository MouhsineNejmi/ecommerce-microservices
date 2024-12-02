import { z } from 'zod';

const coordinatesSchema = z.object({
  lat: z
    .number()
    .min(-90, { message: 'Latitude must be between -90 and 90' })
    .max(90, { message: 'Latitude must be between -90 and 90' }),
  lng: z
    .number()
    .min(-180, { message: 'Longitude must be between -180 and 180' })
    .max(180, { message: 'Longitude must be between -180 and 180' }),
});

const locationSchema = z.object({
  address: z
    .string()
    .trim()
    .min(5, { message: 'Address must be at least 5 characters' })
    .max(100, { message: 'Address cannot exceed 100 characters' }),
  city: z
    .string()
    .trim()
    .min(2, { message: 'City must be at least 2 characters' })
    .max(50, { message: 'City cannot exceed 50 characters' }),
  state: z
    .string()
    .trim()
    .min(2, { message: 'State must be at least 2 characters' })
    .max(50, { message: 'State cannot exceed 50 characters' }),
  country: z
    .string()
    .trim()
    .min(2, { message: 'Country must be at least 2 characters' })
    .max(50, { message: 'Country cannot exceed 50 characters' }),
  coordinates: coordinatesSchema,
});

const priceSchema = z.object({
  basePrice: z
    .number()
    .min(0, { message: 'Base price must be a positive number' }),
  cleaningFee: z
    .number()
    .min(0, { message: 'Cleaning fee must be positive' })
    .optional(),
  serviceFee: z
    .number()
    .min(0, { message: 'Service fee must be positive' })
    .optional(),
});

const imageSchema = z.object({
  url: z.string().url({ message: 'Invalid image URL' }),
  caption: z
    .string()
    .max(100, { message: 'Caption must not exceed 100 characters' })
    .optional(),
});

export const createListingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, { message: 'Title must be at least 10 characters' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),
  description: z
    .string()
    .trim()
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(5000, { message: 'Description cannot exceed 5000 characters' }),
  location: locationSchema,
  price: priceSchema,
  images: z.array(imageSchema),
  amenities: z.array(z.string({ message: 'Amenities must be valid IDs' })),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  category: z.string().min(1, { message: 'Category is required' }),
  maxGuests: z
    .number()
    .min(1, { message: 'Must have at least 1 guest' })
    .max(50, { message: 'Max guests must be between 1 and 50' }),
  bedrooms: z
    .number()
    .min(0, { message: 'Bedrooms must be 0 or more' })
    .max(50, { message: 'Bedrooms must be between 0 and 50' }),
  beds: z
    .number()
    .min(1, { message: 'Must have at least 1 bed' })
    .max(50, { message: 'Beds must be between 1 and 50' }),
  baths: z
    .number()
    .min(1, { message: 'Baths must be 1 or more' })
    .max(50, { message: 'Baths must be between 0.5 and 50' }),
});

export type ListingSchemaType = z.infer<typeof createListingSchema>;
