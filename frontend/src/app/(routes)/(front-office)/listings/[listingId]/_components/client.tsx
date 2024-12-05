'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Range } from 'react-date-range';
import { differenceInDays, eachDayOfInterval } from 'date-fns';

import EmptyState from '@/components/empty-state';
import { ListingHead } from '@/components/listings/listing-head';
import { ListingInfo } from '@/components/listings/listing-info';
import { ListingReservation } from '@/components/listings/listing-reservation';

import { Host, Listing } from '@/types/listings';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

import { toast } from '@/hooks/use-toast';
import { useRequest } from '@/hooks/use-request';
import { calculateTotal } from '@/lib/utils/calculate-total';

interface ListingClientProps {
  listing: Listing;
  reservations: Reservation<string, string>[] | null;
  user: User | null;
}

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
};

const ListingClient = ({ listing, reservations, user }: ListingClientProps) => {
  const { listingId } = useParams();
  const router = useRouter();
  const price = calculateTotal(listing.price);
  const [totalAmount, setTotalAmount] = useState<number>(price);
  const [guestCount, setGuestCount] = useState(0);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const {
    execute: createReservation,
    loading: isCreatingReservation,
    errors,
  } = useRequest({ method: 'post', url: '/api/reservations' });

  const onCreateReservation = useCallback(async () => {
    if (!user) {
      toast({
        title: 'Login before trying to create a reservation',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createReservation({
        data: {
          listingId,
          startDate: dateRange.startDate?.toISOString(),
          endDate: dateRange.endDate?.toISOString(),
          guestCount,
        },
      });

      if (!errors) {
        toast({ title: 'Property Reserved Successfully!' });
        setDateRange(initialDateRange);
        router.push('/my-reservations');
      }
    } catch {
      toast({
        title: 'Could not create your reservation! Please try again.',
        variant: 'destructive',
      });
    }
  }, [
    createReservation,
    dateRange.endDate,
    dateRange.startDate,
    errors,
    guestCount,
    listingId,
    router,
    user,
  ]);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    const date = new Date();

    reservations?.map((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate ? reservation.startDate : date),
        end: new Date(
          reservation.endDate
            ? reservation.endDate
            : date.setDate(date.getDate() + 1)
        ),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = Math.abs(
        differenceInDays(dateRange.startDate, dateRange.endDate)
      );
      if (dayCount && listing?.price) {
        const totalPrice = dayCount * price;
        setTotalAmount(totalPrice);
      } else {
        setTotalAmount(price);
      }
    }
  }, [dateRange, listing?.price, price]);

  if (!listing) {
    <EmptyState />;
  }

  return (
    <div className='container'>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col gap-6'>
          <ListingHead
            title={listing.title}
            images={listing.images}
            location={listing.location}
            id={listing.id!}
          />

          <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
            <ListingInfo
              user={listing.host as Host}
              category={listing.category}
              description={listing.description}
              bedroomsCount={listing.bedrooms}
              maxGuestCount={listing.maxGuests}
              bathsCount={listing.baths}
              location={listing.location}
            />

            <div className='order-first mb-10 md:order-last md:col-span-3'>
              <ListingReservation
                price={listing.price}
                totalAmount={totalAmount}
                guestCount={guestCount}
                maxGuestCount={listing.maxGuests}
                onGuestCountChange={setGuestCount}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isCreatingReservation}
                disabledDates={disabledDates}
              />
              <div className='mt-2'>{errors}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingClient;
