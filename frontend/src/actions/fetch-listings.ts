import { cookies } from 'next/headers';

import { Listing } from '@/types/listings';
import { ErrorResponse, Pagination, SearchQuery } from '@/types/global';

export async function fetchListings(
  page: number = 1,
  limit: number = 10,
  searchParams: SearchQuery = {}
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

  const {
    category = '',
    minPrice = '',
    maxPrice = '',
    baths = '',
    bedrooms = '',
    beds = '',
    maxGuests = '',
    city = '',
    country = '',
    startDate = '',
    endDate = '',
    status = '',
    search = '',
  } = searchParams;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    category,
    minPrice: minPrice.toString(),
    maxPrice: maxPrice.toString(),
    baths: baths.toString(),
    bedrooms: bedrooms.toString(),
    beds: beds.toString(),
    maxGuests: maxGuests.toString(),
    city,
    country,
    startDate,
    endDate,
    status,
    search,
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
