import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

import { User } from '@/types/user';
import { ErrorResponse } from '@/types/global';

export async function getCurrentUser(): Promise<{
  data?: User;
  errors?: ErrorResponse;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return { errors: 'No authentication token found' };
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
      const errorData = await res.json();
      return { errors: errorData.errors };
    }

    const { data: user } = await res.json();

    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { errors: 'Failed to fetch current user' };
  }
}
