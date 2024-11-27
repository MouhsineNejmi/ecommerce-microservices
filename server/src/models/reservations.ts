import mongoose, { Schema } from 'mongoose';
import { Listing } from './listings';
import { NotFoundError } from '../errors';

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

export interface ReservationAttrs {
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

interface ReservationDoc extends mongoose.Document {
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

interface ReservationModel extends mongoose.Model<ReservationDoc> {
  build(attrs: ReservationAttrs): ReservationDoc;
  checkAvailability(
    listingId: string,
    startDate: Date,
    endDate: Date,
    excludeReservationId?: string
  ): Promise<boolean>;
  calculateTotalAmount(
    listingId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number>;
}

const reservationSchema = new Schema(
  {
    listingId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    startDate: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    endDate: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ReservationStatus,
      default: ReservationStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },
    paymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

reservationSchema.statics.build = (attrs: ReservationAttrs) => {
  return new Reservation(attrs);
};

reservationSchema.statics.checkAvailability = async function (
  listingId: string,
  startDate: Date,
  endDate: Date,
  excludeReservationId?: string
) {
  const overlapping = await this.find({
    listingId,
    status: { $nin: ['cancelled'] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
    ...(excludeReservationId && { _id: { $ne: excludeReservationId } }),
  });

  return overlapping.length === 0;
};

reservationSchema.statics.calculateTotalAmount = async function (
  listingId: string,
  startDate: Date,
  endDate: Date
) {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const baseAmount = Number(listing.price) * nights;

  return baseAmount;
};

const Reservation = mongoose.model<ReservationDoc, ReservationModel>(
  'Reservation',
  reservationSchema
);

export { Reservation };
