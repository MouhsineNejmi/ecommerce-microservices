'use client';

import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { COUNTRIES } from '@/constants/countries';

interface CountrySelectProps {
  onCountryChange?: (countryCode: string) => void;
  defaultValue?: string;
  placeholder?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  onCountryChange,
  defaultValue,
  placeholder = 'Select a country',
}) => {
  const [selectedCountry, setSelectedCountry] = useState(defaultValue || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    onCountryChange?.(value);
    setSearchTerm('');
  };

  return (
    <div className='w-full z-[999]'>
      <Select value={selectedCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder}>
            {selectedCountry
              ? (() => {
                  const country = COUNTRIES.find(
                    (c) => c.code === selectedCountry
                  );
                  return country
                    ? `${country.flag} ${country.name}`
                    : placeholder;
                })()
              : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className='p-2'>
            <Input
              placeholder='Search countries...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='mb-2'
            />
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className='flex items-center'>
                    <span className='mr-2'>{country.flag}</span>
                    <span>
                      {country.name} ({country.code})
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className='text-center text-muted-foreground p-2'>
                No countries found
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelect;
