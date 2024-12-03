'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { ErrorResponse } from '@/types/global';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

export const login = async (
  prevState: {
    email?: string;
    password?: string;
    errors?: ErrorResponse | { email?: string[]; password?: string[] };
    accessToken?: string;
  },
  formData: FormData
) => {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      return {
        ...prevState,
        errors: 'Too many login attempts, please try again later.',
      };
    }

    if (response.status !== 200) {
      const errorData = await response.json();

      return {
        ...prevState,
        errors: errorData.errors || 'Failed to sign in',
      };
    }

    const { data } = await response.json();

    if (data.accessToken) {
      (await cookies()).set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      ...prevState,
      ...data,
      errors: null,
    };
  } catch (error) {
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

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be between 2 and 50 characters' })
    .max(50, { message: 'Name must be between 2 and 50 characters' })
    .refine((value) => value.length > 0, { message: 'Name is required' }),

  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email' }),

  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .refine((value) => /\d/.test(value), {
      message: 'Password must contain at least one number',
    })
    .refine((value) => /[a-zA-Z]/.test(value), {
      message: 'Password must contain at least one letter',
    }),
});

export const register = async (
  prevState: {
    name?: string;
    email?: string;
    password?: string;
    errors?:
      | ErrorResponse
      | { name?: string[]; email?: string[]; password?: string[] };
  },
  formData: FormData
) => {
  try {
    const validatedFields = registerSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = validatedFields.data;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('http://localhost:4000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      return {
        ...prevState,
        errors: 'Too many registration attempts, please try again later.',
      };
    }

    if (response.status !== 201) {
      const errorData = await response.json();

      return {
        ...prevState,
        errors: errorData.errors || 'Failed to register',
      };
    }

    const data = await response.json();

    if (data.accessToken) {
      (await cookies()).set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      ...prevState,
      ...data,
      errors: null,
    };
  } catch (error) {
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

// export const logout = async () => {
//   (await cookies()).delete('accessToken');
// };
