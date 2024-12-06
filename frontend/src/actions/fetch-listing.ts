import { Listing } from '@/types/listings';
import { ErrorResponse } from '@/types/global';

export async function fetchListing(listingId: string): Promise<{
  data?: Listing;
  errors?: ErrorResponse | null;
}> {
  try {
    const res = await fetch(`http://localhost:4000/api/listings/${listingId}`);

    if (!res.ok) {
      // const errorData = await res.json();
      return { errors: 'Failed to fetch data' };
    }

    const { data } = await res.json();

    return { data, errors: null };
  } catch {
    return { errors: 'Something went wrong!' };
  }
}
