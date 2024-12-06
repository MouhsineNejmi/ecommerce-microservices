import EmptyState from '@/components/empty-state';
import ListingCard from '@/components/listings/listing-card';

import { fetchListings } from '@/actions/fetch-listings';
import { getCurrentUser } from '@/actions/get-current-user';

import { SearchQuery } from '@/types/global';

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchQuery>;
}) => {
  const params = await searchParams;
  const { data: listings } = await fetchListings(1, 10, params);
  const { data: user } = await getCurrentUser();

  if (listings?.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 pt-20'>
      {listings?.map((listing) => (
        <ListingCard key={listing.id} listing={listing} currentUser={user} />
      ))}
    </div>
  );
};

export default HomePage;
