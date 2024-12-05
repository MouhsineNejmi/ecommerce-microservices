import { cookies } from 'next/headers';

import { Reservation } from '@/types/reservation';
import { ErrorResponse, Pagination } from '@/types/global';
import { Listing } from '@/types/listings';
import { User } from '@/types/user';

export async function fetchReservations(
  page: number = 1,
  limit: number = 10,
  searchParams: { listingId?: string; userId?: string; search?: string } = {}
): Promise<{
  data?: Reservation<Listing, User>[];
  pagination?: Pagination;
  errors?: ErrorResponse | null;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return { errors: ['Please login to continue'] };
  }

  const { listingId = '', userId = '', search = '' } = searchParams;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    listingId,
    userId,
    search,
  });

  const res = await fetch(
    `http://localhost:4000/api/reservations?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    const data = await res.json();
    return { errors: data.errors as string[] };
  }

  const { data, pagination } = await res.json();

  return { data, pagination, errors: null };
}
