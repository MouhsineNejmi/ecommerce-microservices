import { CircleDot, CircleX, Verified } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { badgeVariant } from '@/lib/utils/badge-variant';
import { PaymentStatus, ReservationStatus } from '@/types/reservation';

interface StatusBadgeProps {
  status?: PaymentStatus | ReservationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variant = badgeVariant(status);

  return (
    <Badge variant={variant} className='gap-1'>
      {variant === 'success' && <Verified size={14} />}{' '}
      {variant === 'warning' && <CircleDot size={14} />}
      {variant === 'destructive' && <CircleX />}
      {status && status}
    </Badge>
  );
};
