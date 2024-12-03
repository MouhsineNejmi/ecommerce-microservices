import { cookies } from 'next/headers';

import { Listing } from '@/types/listings';
import { ErrorResponse, Pagination } from '@/types/global';

export async function fetchListings(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  category: string = '',
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<{
  data?: Listing[];
  pagination?: Pagination;
  errors?: ErrorResponse | null;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return { errors: ['Please login to continue'] };
  }

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    category,
    sortBy,
    sortOrder,
  });

  const res = await fetch(`http://localhost:4000/api/listings?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const data = await res.json();
    return { errors: data.errors as string[] };
  }

  const { data, pagination } = await res.json();

  return { data, pagination, errors: null };
}
