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

interface Amenities {
  icon: string;
  name: string;
}

export interface Listing {
  title: string;
  description: string;
  location: ListingLocation;
  price: ListingPrice;
  images: ListingImage[];
  amenities: Amenities[];
  host: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
}
