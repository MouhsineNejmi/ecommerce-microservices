import { AmenityForm } from '@/components/forms/amenity.form';

import { fetchAmenity } from '@/actions/fetch-amenity';
import { CategoryAmenityType } from '@/schemas/category-amenity.schema';

interface AmenityPageProps {
  params: {
    amenityId: string;
  };
}

const AmenityPage = async ({ params }: AmenityPageProps) => {
  const { amenityId } = await params;
  const amenity =
    amenityId === 'new'
      ? null
      : ((await fetchAmenity(amenityId)) as unknown as CategoryAmenityType);

  return <AmenityForm initialData={amenity} />;
};

export default AmenityPage;
