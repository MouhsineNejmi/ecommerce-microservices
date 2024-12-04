export type Pagination = {
  currentPage: number;
  totalPages: number;
  total: number;
};

export type ErrorResponse = string | string[];

export interface SearchQuery {
  page?: string | number;
  limit?: string | number;
  status?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  city?: string;
  country?: string;
  baths?: string | number;
  bedrooms?: string | number;
  beds?: string | number;
  maxGuests?: string | number;
  startDate?: string;
  endDate?: string;
}
