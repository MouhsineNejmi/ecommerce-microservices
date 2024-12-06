import EmptyState from '@/components/empty-state';
import ListingCard from '@/components/listings/listing-card';
import { Heading } from '@/components/ui/heading';

import { fetchFavoriteListings } from '@/actions/fetch-favorite-listings';
import { getCurrentUser } from '@/actions/get-current-user';

const FavoritesPage = async () => {
  const { data: user } = await getCurrentUser();
  const { data: favoriteListings, errors } = await fetchFavoriteListings();

  if (errors) {
    return <p>Something went wrong. Please try again.</p>;
  }

  return (
    <div className='pt-5'>
      <Heading
        title='My Favorite Listings'
        description="A collection of all the listings you've marked as favorites. Explore and revisit your saved places effortlessly."
      />

      {favoriteListings?.length === 0 && (
        <EmptyState
          title="Look like you don't have any favorites properties"
          subtitle='Try to go add some listing to favourites'
        />
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 pt-5'>
        {favoriteListings &&
          favoriteListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              currentUser={user}
            />
          ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
