import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be between 2 and 50 characters' })
    .max(50, { message: 'Name must be between 2 and 50 characters' }),
  avatar: z.string().optional(),
});

export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
