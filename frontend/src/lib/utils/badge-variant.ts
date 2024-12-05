import { PaymentStatus, ReservationStatus } from '@/types/reservation';

export const badgeVariant = (
  status?: PaymentStatus | ReservationStatus
): 'success' | 'warning' | 'destructive' => {
  if (!status) return 'warning';

  if (
    status ===
    (PaymentStatus.COMPLETED ||
      ReservationStatus.COMPLETED ||
      ReservationStatus.CONFIRMED)
  )
    return 'success';
  if (
    status ===
    (PaymentStatus.FAILED ||
      PaymentStatus.REFUNDED ||
      ReservationStatus.CANCELLED)
  )
    return 'destructive';

  return 'warning';
};
