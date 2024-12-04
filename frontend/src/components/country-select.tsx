'use client';

import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
].sort((a, b) => a.name.localeCompare(b.name));

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
