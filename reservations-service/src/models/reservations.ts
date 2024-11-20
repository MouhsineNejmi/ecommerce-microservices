import mongoose, { Schema } from 'mongoose';

interface ReservationAttrs {
  listingId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
}

interface ReservationDoc extends mongoose.Document {
  listingId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
}

interface ReservationModel extends mongoose.Model<ReservationDoc> {
  build(attrs: ReservationAttrs): ReservationDoc;
}

const reservationSchema = new Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    price: {
      type: Number,
      required: true,
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

const Reservation = mongoose.model<ReservationDoc, ReservationModel>(
  'Reservation',
  reservationSchema
);

export { Reservation };
