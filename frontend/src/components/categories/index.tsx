'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Category } from './category';
import { Category as CategoryType } from '@/types/category';

interface CategoriesProps {
  categories: CategoryType[];
}

export const Categories = ({ categories }: CategoriesProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get('category');
  const isMainPage = pathname === '/';

  if (!isMainPage) return null;

  return (
    <div className='container'>
      <div className='pt-4 flex flex-row items-center justify-between overflow-x-auto'>
        {categories?.map((item) => (
          <Category
            key={item.name}
            name={item.name}
            icon={item.icon}
            selected={category === item.name.toLowerCase()}
          />
        ))}
      </div>
    </div>
  );
};
