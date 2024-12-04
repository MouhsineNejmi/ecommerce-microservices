import Link from 'next/link';
import Search from '@/components/navbar/search';
import { UserMenu } from '@/components/navbar/user-menu';
import { Categories } from '@/components/categories';
import EmptyState from '@/components/empty-state';

import { getCurrentUser } from '@/actions/get-current-user';
import { fetchCategories } from '@/actions/fetch-categories';

export const Navbar = async () => {
  const { data: user } = await getCurrentUser();
  const { data: categories, errors } = await fetchCategories();

  if (errors) {
    return <EmptyState showReset />;
  }

  return (
    <div className='fixed bg-white w-full z-10'>
      <div className='py-4 border-b'>
        <div className='container flex flex-row items-center justify-between gap-3 md-gap-0'>
          <Link href='/'>ElevateX</Link>
          <Search />
          <UserMenu user={user} />
        </div>
      </div>

      {categories && <Categories categories={categories} />}
    </div>
  );
};
