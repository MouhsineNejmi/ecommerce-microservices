import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Plus } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Heading } from '@/components/ui/heading';
import { DataTable } from '@/components/data-table';
import { columns } from './_components/columns';

import { fetchAmenities } from '@/actions/fetch-amenities';

const AmenitiesPage = async () => {
  const { data, pagination } = await fetchAmenities();

  const handlePageChange = async (page: number) => {
    'use server';
    const { data, pagination } = await fetchAmenities(page);
    revalidatePath('/office/amenities');
    return { data, pagination };
  };

  const handleSearch = async (search: string) => {
    'use server';
    const { data, pagination } = await fetchAmenities(1, 10, search);
    revalidatePath('/office/amenities');
    return { data, pagination };
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='/office/amenities'>
                    Amenities
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='flex items-center justify-between'>
            <Heading
              title={`Amenities(${pagination?.total || 0})`}
              description='Manage amenities for your store'
            />
            <Link
              className='bg-purple-500 text-white text-sm gap-2 flex items-center px-4 py-2 rounded-md hover:bg-purple-600 transition-colors'
              href='/office/amenities/new'
            >
              <Plus />
              New Amenity
            </Link>
          </div>
          <DataTable
            data={{ data, pagination }}
            columns={columns}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AmenitiesPage;
