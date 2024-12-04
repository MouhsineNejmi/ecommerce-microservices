import { ListingForm } from '@/components/forms/listing.form';

import { fetchListing } from '@/actions/fetch-listing';
import { fetchCategories } from '@/actions/fetch-categories';
import { fetchAmenities } from '@/actions/fetch-amenities';
import { Listing } from '@/types/listings';

interface ListingPageProps {
  params: {
    listingId: string;
  };
}

const ListingPage = async ({ params }: ListingPageProps) => {
  const { listingId } = await params;

  const listing =
    listingId === 'new'
      ? null
      : ((await fetchListing(listingId)) as unknown as Listing);

  const { data: categories } = await fetchCategories();
  const { data: amenities } = await fetchAmenities();

  return (
    <ListingForm
      initialData={listing}
      categories={categories || []}
      amenities={amenities}
      redirectTo='/office/listings'
    />
  );
};

export default ListingPage;
