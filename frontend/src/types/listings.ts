import { Category } from './category';

export interface ListingLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates: { lat: number; lng: number };
}

export interface ListingPrice {
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
}

export interface ListingImage {
  url: string;
  caption: string;
}

interface Amenities {
  id: string;
  icon: string;
  name: string;
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
}

export enum ListingStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: ListingLocation;
  price: ListingPrice;
  images: ListingImage[];
  amenities: Amenities[];
  host: string | Host;
  status: 'draft' | 'published' | 'archived';
  category: Category;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  createdAt: string;
  updatedAt?: string;
}
