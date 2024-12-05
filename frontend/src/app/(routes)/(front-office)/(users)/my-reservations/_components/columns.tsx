'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

import { StatusBadge } from '@/components/status-badge';
// import { CellAction } from './cell-action';

import { Reservation } from '@/types/reservation';
import { Listing } from '@/types/listings';
import { User } from '@/types/user';

export const columns: ColumnDef<Reservation<Listing, User>>[] = [
  {
    header: 'Image',
    accessorKey: 'image',
    cell: ({ row }) => (
      <div className='flex items-center'>
        <Image
          src={
            row.original?.listingId?.images[0].url ||
            'https://via.placeholder.com/600x400?text=Listing+Image'
          }
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
    accessorKey: 'listingId?.title',
    cell: ({ row }) => row.original.listingId?.title || '',
    enableSorting: true,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    enableSorting: true,
  },
  {
    header: 'Payment Status',
    accessorKey: 'paymentStatus',
    cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
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
    // cell: ({ row }) => <CellAction row={row.original} />,
  },
];
