import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Listing, Reservation, User } from '@/types';

interface RecentReservationsProps {
  reservations: Reservation<Listing, User>[];
  loading?: boolean;
}

export function RecentReservations({
  reservations,
  loading = false,
}: RecentReservationsProps) {
  if (loading) {
    return <div>Loading reservations...</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Recent Reservations</h2>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>
                  {new Date(reservation.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(reservation.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{reservation.guestCount}</TableCell>
                <TableCell>
                  <Badge variant='outline' className='capitalize'>
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='outline' className='capitalize'>
                    {reservation.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  ${reservation.totalAmount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
