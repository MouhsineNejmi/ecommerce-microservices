'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  Trash,
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/alert-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/icon';

import { Amenity } from '@/types/amenity';
import { Pagination } from '@/types/global';
import { useRequest } from '@/hooks/use-request';

interface AmenitiesTableProps {
  data: {
    amenities: Amenity[];
    pagination: Pagination;
  };
  onPageChange: (
    page: number
  ) => Promise<{ amenities: Amenity[]; pagination: Pagination }>;
  onSearch: (search: string) => Promise<{
    amenities: Amenity[];
    pagination: Pagination;
  }>;
}

export const AmenitiesTable = ({
  data,
  onPageChange,
  onSearch,
}: AmenitiesTableProps) => {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [amenities, setAmenities] = useState(data.amenities);
  const [pagination, setPagination] = useState(data.pagination);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState<string | null>(null);
  const { execute: deleteAmenity, loading: isDeletingAmenity } = useRequest({
    method: 'delete',
    url: '/api/amenities',
  });

  const columnHelper = createColumnHelper<Amenity>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('icon', {
        header: 'Icon',
        cell: (info) => {
          const icon = info.getValue();
          return <Icon name={icon} />;
        },
        enableSorting: false,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) => format(new Date(info.getValue()), 'MMMM do, yyyy'),
        sortingFn: 'datetime',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                router.push(`/office/amenities/${row.original.id}`)
              }
              disabled={isDeletingAmenity}
            >
              <Pencil />
            </Button>

            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDelete(row.original.id!)}
              disabled={isDeletingAmenity}
            >
              <Trash />
            </Button>
          </div>
        ),
      }),
    ],
    [isDeletingAmenity, router, columnHelper]
  );

  const table = useReactTable({
    data: amenities,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePageChange = async (page: number) => {
    const { amenities: newAmenities, pagination: newPagination } =
      await onPageChange(page);
    setAmenities(newAmenities);
    setPagination(newPagination);
  };

  const debouncedSearch = useDebouncedCallback(async (search: string) => {
    const { amenities: newAmenities, pagination: newPagination } =
      await onSearch(search);
    setAmenities(newAmenities);
    setPagination(newPagination);
  }, 500);

  const handleSearch = (search: string) => {
    setSearch(search);
    debouncedSearch(search);
  };

  const handleDelete = (id: string) => {
    setAmenityToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (amenityToDelete) {
      try {
        await deleteAmenity({ urlParams: amenityToDelete });
        setAmenities((prev) =>
          prev.filter((amenity) => amenity.id !== amenityToDelete)
        );
      } catch (error) {
        console.error('Error deleting amenity:', error);
      } finally {
        setIsModalOpen(false);
        setAmenityToDelete(null);
      }
    }
  };

  return (
    <div className='space-y-4'>
      <AlertModal
        isOpen={isModalOpen}
        title='Delete Amenity'
        description='Are you sure you want to delete this amenity? This action cannot be undone.'
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmLabel='Delete'
        cancelLabel='Cancel'
      />

      {/* Global Search Input */}
      <div className='flex items-center justify-between'>
        <Input
          placeholder='Search amenities...'
          value={search ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className='max-w-sm'
        />

        {/* Date Sorting Select */}
        <Select
          onValueChange={(value) => {
            setSorting([
              {
                id: 'createdAt',
                desc: value === 'desc',
              },
            ]);
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Sort by Date' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='asc'>Date (Ascending)</SelectItem>
            <SelectItem value='desc'>Date (Descending)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className='cursor-pointer'
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getIsSorted()
                    ? header.column.getIsSorted() === 'desc'
                      ? ' ↓'
                      : ' ↑'
                    : null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
        <div className='text-sm text-muted-foreground'>
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      </div>
    </div>
  );
};

export default AmenitiesTable;
