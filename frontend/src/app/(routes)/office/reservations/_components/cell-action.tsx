'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/alert-modal';
import { useRequest } from '@/hooks/use-request';

import { Reservation } from '@/types/reservation';
import { Listing } from '@/types/listings';
import { User } from '@/types/user';

export const CellAction = ({ row }: { row: Reservation<Listing, User> }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(
    null
  );

  const { execute: cancelReservation, loading: isCancellingReservation } =
    useRequest({
      method: 'delete',
      url: '/api/reservations',
    });

  const handleCancelReservation = (id: string) => {
    setReservationToCancel(id);
    setIsModalOpen(true);
  };

  const confirmCancel = async () => {
    if (reservationToCancel) {
      try {
        await cancelReservation({ urlParams: reservationToCancel });
        router.refresh();
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setIsModalOpen(false);
        setReservationToCancel(null);
      }
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isModalOpen}
        title='Cancel Reservation'
        description='Are you sure you want to cancel your reservation?'
        onConfirm={confirmCancel}
        onCancel={() => setIsModalOpen(false)}
        confirmLabel='Confirm'
        cancelLabel='Back'
      />

      <div className='flex space-x-2'>
        <Button
          variant='destructive'
          size='sm'
          onClick={() => handleCancelReservation(row.id!)}
          disabled={isCancellingReservation}
        >
          <XCircle />
          Cancel Reservation
        </Button>
      </div>
    </>
  );
};
