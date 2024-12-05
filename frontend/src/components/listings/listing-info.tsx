import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';

import { ListingCategory } from '@/components/listings/listing-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Category } from '@/types/category';
import { Host, ListingLocation } from '@/types/listings';

import { getCountryCoordinates } from '@/lib/utils/coordinates';

type ListingInfoProps = {
  user: Host;
  category: Category;
  description: string;
  bedroomsCount: number;
  maxGuestCount: number;
  bathsCount: number;
  location: ListingLocation;
};

export const ListingInfo = ({
  user,
  category,
  description,
  bedroomsCount,
  maxGuestCount,
  bathsCount,
  location,
}: ListingInfoProps) => {
  const LocationMap = useMemo(
    () =>
      dynamic(() => import('../location-map').then((mod) => mod.LocationMap), {
        ssr: false,
      }),
    []
  );

  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <div className='font-semibold flex flex-row items-center gap-2 text-lg'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className='rounded-lg'>
              {user?.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <h4 className=''>Hosted By {user?.name}</h4>
        </div>

        <div className='flex flex-row items-center gap-4 font-light text-sm text-neutral-500'>
          <p>
            {maxGuestCount} guest{maxGuestCount === 1 ? '' : 's'}
          </p>
          <p>{bathsCount} baths</p>
          <p>{bedroomsCount} Bedrooms</p>
        </div>
      </div>

      <hr />

      {category && (
        <ListingCategory icon={category.icon} name={category.name} />
      )}

      <hr />

      <div dangerouslySetInnerHTML={{ __html: description }} />

      <hr />

      <LocationMap
        center={[location.coordinates.lat, location.coordinates.lng]}
        zoom={getCountryCoordinates(location.country || 'MA').zoom}
      />
    </div>
  );
};
