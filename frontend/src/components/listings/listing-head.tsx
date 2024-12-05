'use client';

import React, { useMemo } from 'react';
import { Heading } from '@/components/ui/heading';
import { ImageCarousel } from '@/components/image-carousel';

import { COUNTRIES } from '@/constants/countries';
import { ListingImage, ListingLocation } from '@/types/listings';

type ListingHeadProps = {
  title: string;
  location: ListingLocation;
  images: ListingImage[];
  id: string;
};

export const ListingHead = ({ title, location, images }: ListingHeadProps) => {
  const countryName = useMemo(
    () => COUNTRIES.find((country) => country.code === location.country)?.name,
    [location.country]
  );

  return (
    <>
      <Heading
        title={title}
        description={`${countryName}, ${location?.city}`}
      />

      <div className='w-full h-[60vh] overflow-hidden rounded-xl relative'>
        <ImageCarousel images={images} />
      </div>
    </>
  );
};
