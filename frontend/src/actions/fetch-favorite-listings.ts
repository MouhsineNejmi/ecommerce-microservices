import { cookies } from 'next/headers';

import { ErrorResponse } from '@/types/global';
import { Listing } from '@/types/listings';

export async function fetchFavoriteListings(): Promise<{
  data?: Listing[];
  errors?: ErrorResponse | null;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return { errors: ['Please login to continue'] };
  }

  const res = await fetch(`http://localhost:4000/api/users/favorites`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const data = await res.json();
    return { errors: data.errors };
  }

  const { data } = await res.json();

  return { data, errors: null };
}
