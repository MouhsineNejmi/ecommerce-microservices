'use client';

import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

import { Icon } from '@/components/icon';
import { CellAction } from './cell-action';
import { Amenity } from '@/types/amenity';

export const columns: ColumnDef<Amenity>[] = [
  {
    header: 'Icon',
    accessorKey: 'icon',
    cell: ({ row }) => (
      <div className='flex items-center'>
        <Icon name={row.original.icon} />
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
