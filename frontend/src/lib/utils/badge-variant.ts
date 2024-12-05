import { PaymentStatus, ReservationStatus } from '@/types/reservation';

export const badgeVariant = (
  status?: PaymentStatus | ReservationStatus
): 'success' | 'warning' | 'destructive' => {
  if (!status) return 'warning';

  if (
    status === PaymentStatus.COMPLETED ||
    status === ReservationStatus.COMPLETED ||
    status === ReservationStatus.CONFIRMED
  )
    return 'success';

  if (
    status === PaymentStatus.FAILED ||
    status === PaymentStatus.REFUNDED ||
    status === ReservationStatus.CANCELLED
  ) {
    return 'destructive';
  }

  return 'warning';
};
