import ListingClient from './_components/client';

import { fetchListing } from '@/actions/fetch-listing';
import { getCurrentUser } from '@/actions/get-current-user';
import { fetchReservations } from '@/actions/fetch-reservations';

const ListingPage = async ({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) => {
  const { listingId } = await params;
  const { data: listing } = await fetchListing(listingId);
  const { data: user } = await getCurrentUser();
  const { data: reservations } = await fetchReservations(1, 10, { listingId });

  return (
    <ListingClient
      listing={listing!}
      reservations={reservations!}
      user={user!}
    />
  );
};

export default ListingPage;
