import { CategoryForm } from '@/components/forms/category.form';

import { fetchCategory } from '@/actions/fetch-category';
import { CategoryAmenityType } from '@/schemas/category-amenity.schema';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { categoryId } = await params;
  const category =
    categoryId === 'new'
      ? null
      : ((await fetchCategory(categoryId)) as unknown as CategoryAmenityType);

  return <CategoryForm initialData={category} />;
};

export default CategoryPage;
