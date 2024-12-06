import { revalidatePath } from 'next/cache';

import EmptyState from '@/components/empty-state';
import { Heading } from '@/components/ui/heading';
import DataTable from '@/components/data-table';
import { columns } from './_components/columns';

import { getCurrentUser } from '@/actions/get-current-user';
import { fetchReservations } from '@/actions/fetch-reservations';

const ReservationsPage = async () => {
  const { data: user } = await getCurrentUser();
  const {
    data: reservations,
    pagination,
    errors,
  } = await fetchReservations(1, 10, {
    userId: user?.id,
  });

  const handlePageChange = async (page: number) => {
    'use server';
    const { data, pagination } = await fetchReservations(page);
    revalidatePath('/office/reservations');
    return {
      data: data || [],
      pagination: pagination || {
        currentPage: 0,
        totalPages: 0,
        total: 0,
      },
    };
  };

  const handleSearch = async (search: string) => {
    'use server';
    const { data, pagination } = await fetchReservations(1, 10, { search });
    revalidatePath('/office/reservations');
    return {
      data: data || [],
      pagination: pagination || {
        currentPage: 0,
        totalPages: 0,
        total: 0,
      },
    };
  };

  if (errors) {
    return <p>Something went wrong. Please try again.</p>;
  }

  if (reservations?.length === 0) {
    return (
      <EmptyState
        title="Look like there's no reservations"
        subtitle='Here you can view all the reservations across the platform'
      />
    );
  }

  return (
    <div className='pt-5'>
      <div className='flex items-center justify-between mb-8'>
        <Heading
          title='All Reservations'
          description='A collection of all the reservations. '
        />
      </div>

      {reservations && pagination && (
        <DataTable
          data={{ data: reservations, pagination }}
          columns={columns}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
        />
      )}

      {errors && errors}
    </div>
  );
};

export default ReservationsPage;
