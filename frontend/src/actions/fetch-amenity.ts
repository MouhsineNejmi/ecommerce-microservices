import { cookies } from 'next/headers';

import { Amenity } from '@/types/amenity';

export async function fetchAmenity(amenityId: string): Promise<{
  data: Amenity[];
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('No authentication token found');
  }

  try {
    const res = await fetch(
      `http://localhost:4000/api/amenities/${amenityId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `accessToken=${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch amenities: ', error);
    throw error;
  }
}
