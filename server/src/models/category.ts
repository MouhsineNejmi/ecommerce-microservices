import mongoose from 'mongoose';

export interface CategoryAttrs {
  icon: string;
  name: string;
}

export interface CategoryDocument extends mongoose.Document {
  icon: string;
  name: string;
}

interface CategoryModel extends mongoose.Model<CategoryDocument> {
  build(attrs: CategoryAttrs): any;
}

const categorySchema = new mongoose.Schema(
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

categorySchema.statics.build = (attrs: CategoryAttrs) => {
  return new Category(attrs);
};

const Category = mongoose.model<CategoryDocument, CategoryModel>(
  'Category',
  categorySchema
);

export { Category };
