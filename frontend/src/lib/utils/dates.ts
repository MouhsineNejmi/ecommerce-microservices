import { differenceInDays } from 'date-fns';

export function calculateNights(startDate: string, endDate: string): number {
  return differenceInDays(new Date(endDate), new Date(startDate));
}
