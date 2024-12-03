export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface Reservation {
  listingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  guestCount: number;
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
  paymentIntentId?: string;
}
