import { cookies } from 'next/headers';

import { Reservation } from '@/types/reservation';
import { ErrorResponse, Pagination } from '@/types/global';

export async function fetchReservations(
  page: number = 1,
  limit: number = 10,
  searchParams: { listingId?: string } = {}
): Promise<{
  data?: Reservation[];
  pagination?: Pagination;
  errors?: ErrorResponse | null;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return { errors: ['Please login to continue'] };
  }

  const { listingId } = searchParams;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (listingId) {
    queryParams.append('listingId', listingId);
  }

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
