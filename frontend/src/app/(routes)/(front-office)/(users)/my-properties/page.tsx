import Link from 'next/link';
import { Plus } from 'lucide-react';
import { revalidatePath } from 'next/cache';

import EmptyState from '@/components/empty-state';
import DataTable from '@/components/data-table';
import { Heading } from '@/components/ui/heading';
import { columns } from './_components/columns';

import { getCurrentUser } from '@/actions/get-current-user';
import { fetchListings } from '@/actions/fetch-listings';
import { PAGINATION_INITIAL_STATE } from '@/constants/pagination';

const MyPropertiesPage = async () => {
  const { data: user } = await getCurrentUser();
  const {
    data: currentUserListings,
    pagination,
    errors,
  } = await fetchListings(1, 10, {
    hostId: user?.id,
  });

  const handlePageChange = async (page: number) => {
    'use server';
    const { data, pagination } = await fetchListings(page);
    revalidatePath('/my-properties');
    return {
      data: data || [],
      pagination: pagination || PAGINATION_INITIAL_STATE,
    };
  };

  const handleSearch = async (search: string) => {
    'use server';
    const { data, pagination } = await fetchListings(1, 10, { search });
    revalidatePath('/my-properties');
    return {
      data: data || [],
      pagination: pagination || PAGINATION_INITIAL_STATE,
    };
  };

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
          href='/my-properties/new'
        >
          <Plus />
          New Listing
        </Link>
      </div>

      {currentUserListings && pagination && (
        <DataTable
          data={{ data: currentUserListings, pagination }}
          columns={columns}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
        />
      )}
    </div>
  );
};

export default MyPropertiesPage;
