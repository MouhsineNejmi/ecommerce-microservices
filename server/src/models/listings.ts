import mongoose from 'mongoose';

interface ListingLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates: { lat: number; lng: number };
}

interface ListingPrice {
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
}

interface ListingImage {
  url: string;
  caption: string;
}

export interface ListingAttrs {
  title: string;
  description: string;
  location: ListingLocation;
  price: ListingPrice;
  images: ListingImage[];
  amenities: mongoose.Schema.Types.ObjectId[];
  host: mongoose.Schema.Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  category: mongoose.Schema.Types.ObjectId;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
}

export interface ListingDocument extends mongoose.Document {
  title: string;
  description: string;
  location: ListingLocation;
  price: ListingPrice;
  images: ListingImage[];
  amenities: mongoose.Schema.Types.ObjectId[];
  host: mongoose.Schema.Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  category: mongoose.Schema.Types.ObjectId;
}

interface ListingModel extends mongoose.Model<ListingDocument> {
  build(attrs: ListingAttrs): any;
}

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    price: {
      basePrice: { type: Number, required: true },
      cleaningFee: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
    },
    images: [{ url: String, caption: String }],
    amenities: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Amenity', required: true },
    ],
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    maxGuests: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
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

listingSchema.statics.build = (attrs: ListingAttrs) => {
  return new Listing(attrs);
};

const Listing = mongoose.model<ListingDocument, ListingModel>(
  'Listing',
  listingSchema
);

export { Listing };
