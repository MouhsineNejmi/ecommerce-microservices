import Link from 'next/link';
import { Plus } from 'lucide-react';

import EmptyState from '@/components/empty-state';
import ListingCard from '@/components/listings/listing-card';
import { Heading } from '@/components/ui/heading';

import { getCurrentUser } from '@/actions/get-current-user';
import { fetchListings } from '@/actions/fetch-listings';

const MyPropertiesPage = async () => {
  const { data: user } = await getCurrentUser();
  const { data: currentUserListings, errors } = await fetchListings(1, 10, {
    hostId: user?.id,
  });

  if (errors) {
    return <p>Something went wrong. Please try again.</p>;
  }

  if (currentUserListings?.length === 0) {
    return (
      <>
        <EmptyState
          title="Look like you don't have any properties listed"
          subtitle='Try to go add some listing.'
          action={
            <Link
              className='bg-purple-500 text-white text-sm gap-2 flex items-center px-4 py-2 rounded-md hover:bg-purple-600 transition-colors'
              href='/my-properties/new'
            >
              <Plus />
              New Listing
            </Link>
          }
        />
      </>
    );
  }

  return (
    <div className='pt-5'>
      <div className='flex items-center justify-between mb-8'>
        <Heading
          title='My Listings'
          description="A collection of all the listings you've marked as favorites. Explore and revisit your saved places effortlessly."
        />

        <Link
          className='bg-purple-500 text-white text-sm gap-2 flex items-center px-4 py-2 rounded-md hover:bg-purple-600 transition-colors'
          href='/office/listings/new'
        >
          <Plus />
          New Listing
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 pt-5'>
        {currentUserListings?.map((listing) => (
          <ListingCard key={listing.id} listing={listing} currentUser={user} />
        ))}
      </div>
    </div>
  );
};

export default MyPropertiesPage;
