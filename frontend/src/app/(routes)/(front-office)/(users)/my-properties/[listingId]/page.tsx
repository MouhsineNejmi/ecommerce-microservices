import { fetchAmenities } from '@/actions/fetch-amenities';
import { fetchCategories } from '@/actions/fetch-categories';
import { fetchListing } from '@/actions/fetch-listing';
import { ListingForm } from '@/components/forms/listing.form';

const CreateProperty = async ({
  params,
}: {
  params: { listingId: string };
}) => {
  const { listingId } = await params;
  const { data: categories } = await fetchCategories();
  const { data: amenities } = await fetchAmenities();
  const { data: listing } = await fetchListing(listingId);

  console.log(listingId);

  return (
    <ListingForm
      initialData={listing}
      categories={categories || []}
      amenities={amenities || []}
      redirectTo='/my-properties'
    />
  );
};

export default CreateProperty;
