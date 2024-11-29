'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';
import { Category } from '@/types/category';

export const columns: ColumnDef<Category>[] = [
  {
    header: 'Icon',
    accessorKey: 'icon',
    cell: ({ row }) => (
      <div className='flex items-center'>
        <Image
          src={row.original.icon}
          alt='icon'
          width={20}
          height={20}
          className='mr-2'
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    header: 'Name',
    accessorKey: 'name',
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
