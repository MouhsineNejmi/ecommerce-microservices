'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { ErrorResponse } from '@/types/global';

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

const createListingSchema = z.object({
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
  images: z.array(imageSchema).optional(),
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

export const createListing = async (
  prevState: {
    data?: unknown;
    errors?: ErrorResponse | Record<string, string[]>;
  },
  formData: FormData
) => {
  try {
    const locationData = {
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      country: formData.get('country'),
      coordinates: formData.get('coordinates') as string,
    };

    const priceData = {
      basePrice: Number(formData.get('basePrice')),
      cleaningFee: Number(formData.get('cleaningFee') || 0),
      serviceFee: Number(formData.get('serviceFee') || 0),
    };

    const validatedFields = createListingSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      location: locationData,
      price: priceData,
      images: formData.get('images') || [],
      amenities: formData.get('amenities'),
      status: formData.get('status') || 'draft',
      category: formData.get('category'),
      maxGuests: Number(formData.get('maxGuests')),
      bedrooms: Number(formData.get('bedrooms')),
      beds: Number(formData.get('beds')),
      baths: Number(formData.get('baths')),
    });

    console.log(formData.get('amenitites'));

    if (!validatedFields.success) {
      return {
        ...prevState,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const accessToken = (await cookies()).get('accessToken')?.value;

    const response = await fetch('http://localhost:4000/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validatedFields.data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ...prevState,
        errors: errorData.errors || 'Failed to create listing',
      };
    }

    const data = await response.json();

    return {
      data,
      errors: null,
    };
  } catch (error) {
    console.error('Listing creation error:', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        ...prevState,
        errors: 'Request timed out. Please try again.',
      };
    }

    return {
      ...prevState,
      errors: 'An unexpected error occurred. Please try again.',
    };
  }
};
