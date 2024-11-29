'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/alert-modal';
import { useRequest } from '@/hooks/use-request';

import { Listing } from '@/types/listings';

export const CellAction = ({ row }: { row: Listing }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { execute: deleteItem, loading: isDeletingItem } = useRequest({
    method: 'delete',
    url: '/api/listings',
  });

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteItem({ urlParams: itemToDelete });
        router.push('/office/listings');
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setIsModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isModalOpen}
        title='Delete Item'
        description='Are you sure you want to delete this item? This action cannot be undone.'
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmLabel='Delete'
        cancelLabel='Cancel'
      />

      <div className='flex space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => router.push(`/office/listings/${row.id}`)}
          disabled={isDeletingItem}
        >
          <Pencil />
        </Button>

        <Button
          variant='destructive'
          size='sm'
          onClick={() => handleDelete(row.id)}
          disabled={isDeletingItem}
        >
          <Trash />
        </Button>
      </div>
    </>
  );
};
