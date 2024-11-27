import mongoose from 'mongoose';

export interface AmenityAttrs {
  icon: string;
  name: string;
}

export interface AmenityDocument extends mongoose.Document {
  icon: string;
  name: string;
}

interface AmenityModel extends mongoose.Model<AmenityDocument> {
  build(attrs: AmenityAttrs): any;
}

const amenitySchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    name: { type: String, required: true },
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

amenitySchema.statics.build = (attrs: AmenityAttrs) => {
  return new Amenity(attrs);
};

const Amenity = mongoose.model<AmenityDocument, AmenityModel>(
  'Amenity',
  amenitySchema
);

export { Amenity };
