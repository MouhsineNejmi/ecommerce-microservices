'use client';

import React, { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { Listing } from '@/types/listings';
import { ImageCarousel } from '@/components/image-carousel';
import { Button } from '@/components/ui/button';
import { HeartButton } from '@/components/heart-button';

import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';
import { COUNTRIES } from '@/constants/countries';
import { Pencil } from 'lucide-react';

type ListingCardProps = {
  listing: Listing;
  reservation?: Reservation;
  currentUser?: User | null;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  onAction?: (id: string) => void;
};

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  reservation,
  currentUser,
  disabled,
  actionLabel,
  actionId = '',
  onAction,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isOwner =
    pathname === '/my-properties' && listing.host === currentUser?.id;

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) return;

      onAction?.(actionId);
    },
    [disabled, actionId, onAction]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalAmount;
    }

    return (
      Number(listing.price.basePrice) +
      Number(listing.price.cleaningFee) +
      Number(listing.price.serviceFee)
    );
  }, [reservation, listing.price]);

  const countryName = useMemo(
    () =>
      COUNTRIES.find((country) => country.code === listing.location.country)
        ?.name,
    [listing.location.country]
  );

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const date = new Date();
    const start = reservation.startDate ? reservation.startDate : date;
    const end = reservation.endDate
      ? reservation.endDate
      : date.setDate(date.getDate() + 1);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  return (
    <div className='col-span-1 cursor-pointer group'>
      <div className='relative'>
        <ImageCarousel images={listing.images} />
        <div className='absolute right-2 top-2'>
          {listing.id && (
            <HeartButton listingId={listing.id} currentUser={currentUser} />
          )}
        </div>
        {isOwner && (
          <div className='absolute left-2 top-2'>
            <button
              onClick={() => router.push(`/my-properties/${listing.id}`)}
              className='relative w-8 h-8 bg-white/70 rounded-full flex items-center justify-center shadow-sm hover:opacity-80 transition cursor-pointer'
            >
              <Pencil size={18} />
            </button>
          </div>
        )}
      </div>

      <div onClick={() => router.push(`/listings/${listing.id}`)}>
        <h3 className='font-semibold text-sm mt-2 mb-1'>
          {countryName}, {listing.location.city}
        </h3>

        <p className='font-light text-sm text-neutral-600 mb-1'>
          {reservationDate || listing.category.name}
        </p>

        <div className='flex flex-row items-center gap-1 mb-1'>
          <h3 className='font-semibold text-sm'>$ {price}</h3>
          {!reservation && <p className='font-light text-sm'>/night</p>}
        </div>

        {onAction && actionLabel && (
          <Button disabled={disabled} onClick={handleCancel}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
