'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';
import { Listing } from '@/types/listings';

export const columns: ColumnDef<Listing>[] = [
  {
    header: 'Image',
    accessorKey: 'image',
    cell: (info) => (
      <div className='flex items-center'>
        <Image
          src={info.row.original?.images[0]?.url}
          alt='icon'
          width={100}
          height={100}
          className='mr-2'
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    header: 'Title',
    accessorKey: 'title',
    enableSorting: true,
  },
  {
    header: 'Category',
    accessorKey: 'category.name',
    enableSorting: true,
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'MMMM do, yyyy'),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction row={row.original} />,
  },
];
