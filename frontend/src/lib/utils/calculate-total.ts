import { ListingPrice } from '@/types/listings';

export const calculateTotal = (price: ListingPrice) => {
  return price.basePrice + price.serviceFee + price.cleaningFee;
};
