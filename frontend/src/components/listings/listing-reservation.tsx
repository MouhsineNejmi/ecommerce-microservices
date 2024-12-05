import { Range } from 'react-date-range';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/inputs/date-picker';
import { ListingPrice } from '@/types/listings';
import { calculateNights } from '@/lib/utils/dates';
import { Counter } from '../inputs/counter';

interface ListingReservationProps {
  price: ListingPrice;
  dateRange: Range;
  maxGuestCount: number;
  guestCount: number;
  totalAmount: number;
  onChangeDate: (value: Range) => void;
  onGuestCountChange: (value: number) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
}

export const ListingReservation = ({
  price,
  dateRange,
  totalAmount,
  maxGuestCount,
  guestCount,
  onChangeDate,
  onGuestCountChange,
  onSubmit,
  disabled,
  disabledDates,
}: ListingReservationProps) => {
  const { startDate, endDate } = dateRange;
  const nights =
    startDate && endDate
      ? calculateNights(startDate.toString(), endDate.toString())
      : 0;
  const subtotal = price.basePrice * nights;

  return (
    <div className='bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden p-4'>
      <div className='flex flex-row items-center gap-1 p-2'>
        <p className='text-xl font-semibold'>$ {price.basePrice}</p>
        <span className='font-light text-neutral-600'>/night</span>
      </div>

      <hr />

      <DatePicker
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />

      <hr />

      <div className='my-4'>
        <Counter
          title='How many guests are you?'
          subtitle=''
          value={guestCount}
          onChange={onGuestCountChange}
          maxValue={maxGuestCount}
        />
      </div>

      <hr />

      {startDate && endDate && (
        <div className='mt-4 space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>
              ${price.basePrice} × {nights} night
              {nights !== 1 ? 's' : ''}
            </span>
            <span>${subtotal}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Cleaning fee</span>
            <span>${price.cleaningFee}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Service fee</span>
            <span>${price.serviceFee}</span>
          </div>
          <div className='flex justify-between pt-4 border-t font-semibold'>
            <span>Total</span>
            <span>${totalAmount}</span>
          </div>
        </div>
      )}

      <div className='flex justify-end mt-2'>
        <Button disabled={disabled || nights === 0} onClick={onSubmit}>
          Reserve
        </Button>
      </div>
    </div>
  );
};
