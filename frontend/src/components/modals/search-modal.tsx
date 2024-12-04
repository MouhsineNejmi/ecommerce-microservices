'use client';

import { useCallback, useMemo, useState } from 'react';
import { Range } from 'react-date-range';
import { useRouter } from 'next/navigation';
import { formatISO } from 'date-fns';

import { useSearchModal } from '@/hooks/use-search-modal';

import { Modal } from '@/components/modals';
import CountrySelect from '@/components/country-select';
import { Heading } from '@/components/ui/heading';
import { DatePicker } from '@/components/inputs/date-picker';
import { Counter } from '@/components/inputs/counter';
import { useParams } from 'next/navigation';
import { SearchQuery } from '@/types/global';

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

export const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useParams();

  const [step, setStep] = useState(STEPS.LOCATION);

  const [country, setCountry] = useState<string>('MA');
  const [maxGuestCount, setMaxGuestCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [bedsCount, setBedsCount] = useState(1);
  const [bedroomsCount, setBedroomsCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    const updatedQuery: SearchQuery = {
      ...params,
      country,
      beds: bedsCount,
      maxGuests: maxGuestCount,
      baths: bathroomCount,
      bedrooms: bedroomsCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = new URLSearchParams(
      Object.entries(updatedQuery).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push('?' + url.toString());
  }, [
    step,
    params,
    country,
    bedsCount,
    maxGuestCount,
    bathroomCount,
    bedroomsCount,
    dateRange.startDate,
    dateRange.endDate,
    searchModal,
    router,
    onNext,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search';
    }

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className='flex flex-col gap-6'>
      <Heading
        title='Where do you wanna go?'
        description='Find the perfect location!'
      />
      <CountrySelect
        defaultValue={country}
        onCountryChange={(value) => setCountry(value)}
      />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='When do you plan to go?'
          description='Make sure everyone is free!'
        />
        <DatePicker
          onChange={(value) => setDateRange(value.selection)}
          value={dateRange}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
          title='More information'
          description='Find your perfect place!'
        />
        <Counter
          onChange={(value) => setMaxGuestCount(value)}
          value={maxGuestCount}
          title='Max Guests'
          subtitle='How many guests are coming?'
        />
        <hr />
        <Counter
          onChange={(value) => setBedroomsCount(value)}
          value={bedroomsCount}
          title='Bedrooms'
          subtitle='How many bedrooms do you need?'
        />
        <hr />
        <Counter
          onChange={(value) => setBedsCount(value)}
          value={bedsCount}
          title='Beds'
          subtitle='How many beds do you need?'
        />
        <hr />
        <Counter
          onChange={(value) => {
            setBathroomCount(value);
          }}
          value={bathroomCount}
          title='Bathrooms'
          subtitle='How many bahtrooms do you need?'
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title='Filters'
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};
