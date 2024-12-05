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

export interface Reservation<T, U> {
  listingId: T;
  userId: U;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  guestCount: number;
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
  createdAt: string;
}
