'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { Listing } from '@/types/listings';
import { ImageCarousel } from '@/components/image-carousel';
import { Button } from '@/components/ui/button';
import { HeartButton } from '@/components/heart-button';

import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

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
    <div
      onClick={() => router.push(`/listings/${listing.id}`)}
      className='col-span-1 cursor-pointer group'
    >
      <div className='relative'>
        <ImageCarousel images={listing.images} />
        <div className='absolute right-2 top-2'>
          {listing.id && (
            <HeartButton listingId={listing.id} currentUser={currentUser} />
          )}
        </div>
      </div>

      <h3 className='font-semibold text-sm mt-2 mb-1'>
        {listing.location.country}, {listing.location.city}
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
  );
};

export default ListingCard;
