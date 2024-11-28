import { cookies } from 'next/headers';

import { User } from '@/types/user';

export async function getCurrentUser(): Promise<{
  data: User;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('No authentication token found');
  }

  try {
    const res = await fetch('http://localhost:4000/api/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch current user');
    }

    const { data } = await res.json();

    return { data };
  } catch (error) {
    console.error('Failed to fetch current user: ', error);
    throw error;
  }
}
