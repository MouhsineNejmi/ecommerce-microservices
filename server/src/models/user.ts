import mongoose from 'mongoose';
import { ListingAttrs } from './listings';

import { Password } from '../services/password.service';
import { UserRole } from '../types/user.types';

interface UserAddress {
  street: String;
  city: String;
  state: String;
  zipCode: String;
  country: String;
  isDefault: Boolean;
}

interface UserAttrs {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  addresses?: UserAddress[];
  favorites?: ListingAttrs[];
}

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  addresses: UserAddress[];
  favorites?: ListingAttrs[];
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): any;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    favorites: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Listing',
        default: [],
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.hash(this.get('password'));
    this.set('password', hashedPassword);
  }
  next();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
