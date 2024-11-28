import { z } from 'zod';

export const CategoryAmenitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be between 2 and 50 characters' })
    .max(50, { message: 'Name must be between 2 and 50 characters' })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: 'Name can only contain alphanumeric characters',
    }),
  icon: z
    .string()
    .trim()
    .min(2, { message: 'Icon must be at least 2 characters' }),
});

export type CategoryAmenityType = z.infer<typeof CategoryAmenitySchema>;
