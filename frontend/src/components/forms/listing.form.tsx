'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DollarSign, Loader2, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/tiptap-editor';
import { AlertModal } from '@/components/alert-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/icon';
import { ImageUploader } from '@/components/image-uploader';
import CountrySelect from '../country-select';

import { useRequest } from '@/hooks/use-request';
import { toast } from '@/hooks/use-toast';

import {
  createListingSchema,
  ListingSchemaType,
} from '@/schemas/listing.schema';

import { Category } from '@/types/category';
import { Amenity } from '@/types/amenity';
import { Listing, ListingStatus } from '@/types/listings';
import { getCountryCoordinates } from '@/lib/utils/coordinates';

interface ListingFormProps {
  initialData?: Listing | null;
  categories: Category[];
  amenities: Amenity[];
  redirectTo?: '/my-properties' | '/office/listings';
}

export const ListingForm = ({
  initialData,
  categories,
  amenities,
  redirectTo = '/my-properties',
}: ListingFormProps) => {
  const { listingId } = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<{ url: string; caption: string }[]>(
    initialData?.images || []
  );
  // const [selectedLocation, setSelectedLocation] = useState<{
  //   lat: number;
  //   lng: number;
  // }>({
  //   lat: initialData?.location?.coordinates?.lat || 0,
  //   lng: initialData?.location?.coordinates?.lng || 0,
  // });

  const title = initialData ? 'Edit listing' : 'Create listing';
  const description = initialData ? 'Update a listing' : 'Add a new listing';
  const toastMessage = initialData
    ? 'Listing updated successfully!'
    : 'Listing created successfully!';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ListingSchemaType>({
    resolver: zodResolver(createListingSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          amenities: initialData.amenities.map((a) => a.id || ''),
          category: initialData.category?.id || '',
        }
      : {
          title: '',
          description: '<p>Listing description</p>',
          price: {
            basePrice: 5,
            cleaningFee: 0,
            serviceFee: 0,
          },
          location: {
            address: '',
            city: '',
            state: '',
            country: 'MA',
            coordinates: { lat: 0, lng: 0 },
          },
          status: 'draft',
          category: '',
          maxGuests: 1,
          bedrooms: 1,
          beds: 1,
          baths: 1,
          amenities: [],
        },
  });

  const handleImageChange = (newImages: { url: string; caption: string }[]) => {
    setImages(newImages);
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amenityId = e.target.value;
    const isChecked = e.target.checked;

    const currentAmenities = form.getValues('amenities') || [];

    const updatedAmenities = isChecked
      ? [...currentAmenities, amenityId]
      : currentAmenities.filter((id) => id !== amenityId);

    form.setValue('amenities', updatedAmenities);
  };

  // const handleLocationSelect = (lat: number, lng: number) => {
  //   form.setValue('location.coordinates.lat', lat);
  //   form.setValue('location.coordinates.lng', lng);

  //   form.trigger('location.coordinates');

  //   setSelectedLocation({ lat, lng });
  // };

  const { execute: createListing, loading: isCreatingListing } = useRequest({
    url: '/api/listings',
    method: 'post',
  });
  const { execute: editListing, loading: isEditingListing } = useRequest({
    url: `/api/listings/${listingId}`,
    method: 'put',
  });
  const { execute: deleteListing, loading: isDeletingListing } = useRequest({
    url: `/api/listings/${listingId}`,
    method: 'delete',
  });

  const onSubmit = async (values: ListingSchemaType) => {
    const listingData = {
      ...values,
      images,
    };

    try {
      if (initialData) {
        await editListing({ data: listingData });
      } else {
        await createListing({ data: listingData });
      }

      router.push(redirectTo);
      toast({ title: toastMessage });
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteListing();
      router.push(redirectTo);
      toast({ title: 'Listing deleted successfully.' });
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const loading = isCreatingListing || isEditingListing || isDeletingListing;

  const LocationMap = useMemo(
    () =>
      dynamic(() => import('../location-map').then((mod) => mod.LocationMap), {
        ssr: false,
      }),
    []
  );

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />

        {initialData && (
          <>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => setIsModalOpen(true)}
              className='mt-4'
            >
              <Trash className='h-4 w-4' />
            </Button>

            <AlertModal
              title='Confirm Deletion'
              description='Are you sure you want to delete this item? This action cannot be undone.'
              isOpen={isModalOpen}
              onConfirm={handleDelete}
              onCancel={() => setIsModalOpen(false)}
            />
          </>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full mt-8 space-y-8'
        >
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUploader
                    initialImages={initialData?.images}
                    onChange={(images) => {
                      handleImageChange(images);
                      form.setValue('images', images);
                    }}
                    maxImages={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter a descriptive title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={() => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <TiptapEditor
                    name='description'
                    initialContent={
                      initialData?.description || form.getValues('description')
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id!} value={category.id!}>
                          <div className='flex items-center gap-2'>
                            <Image
                              src={category.icon}
                              alt={category.name}
                              width={20}
                              height={20}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const validStatus = Object.values(ListingStatus).includes(
                        value as ListingStatus
                      )
                        ? value
                        : undefined;
                      field.onChange(validStatus);
                    }}
                    value={field.value || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a status' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ListingStatus).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          defaultChecked={status === form.getValues('status')}
                          className='flex items-center justify-between'
                        >
                          <span className='capitalize'>{status}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='amenities'
            render={({ field: { value } }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <div className='grid grid-cols-3 gap-2'>
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          id={`amenity-${amenity.id}`}
                          value={amenity.id}
                          checked={value?.includes(amenity.id!)}
                          onChange={handleAmenitiesChange}
                        />
                        <Label
                          htmlFor={`amenity-${amenity.id}`}
                          className='flex items-center gap-2'
                        >
                          <Icon name={amenity.icon} size={16} />
                          {amenity.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='maxGuests'
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Max Guests</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter the maximum number of guests'
                    onChange={(e) => {
                      const value =
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value);
                      onChange(value);
                    }}
                    min={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='baths'
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Baths</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter the number of baths'
                    onChange={(e) => {
                      const value =
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value);
                      onChange(value);
                    }}
                    min={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bedrooms'
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter the number of bedrooms'
                    onChange={(e) => onChange(Number(e.target.value))}
                    min={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='beds'
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Beds</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter the number of beds'
                    onChange={(e) => onChange(Number(e.target.value))}
                    min={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Pricing */}
          <div className='grid gap-4'>
            <FormField
              control={form.control}
              name='price.basePrice'
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Base Price (per night)</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <DollarSign className='absolute left-3 top-2 h-5 w-5 text-muted-foreground' />
                      <Input
                        type='number'
                        className='pl-10'
                        placeholder='0.00'
                        min={5}
                        onChange={(e) => onChange(Number(e.target.value))}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This is the base nightly rate for your listing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price.cleaningFee'
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Cleaning Fee</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <DollarSign className='absolute left-3 top-2 h-5 w-5 text-muted-foreground' />
                      <Input
                        type='number'
                        className='pl-10'
                        placeholder='0.00'
                        min={0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    One-time fee charged to guests for cleaning
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price.serviceFee'
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Service Fee</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <DollarSign className='absolute left-3 top-2 h-5 w-5 text-muted-foreground' />
                      <Input
                        type='number'
                        className='pl-10'
                        placeholder='0.00'
                        min={0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Additional service fee charged to guests
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location */}
          <div className='grid gap-4'>
            <FormField
              control={form.control}
              name='location.country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <CountrySelect
                      defaultValue={field.value}
                      onCountryChange={(value) => {
                        field.onChange(value);
                        const coords = getCountryCoordinates(value);
                        form.setValue('location.coordinates', {
                          lat: coords.lat,
                          lng: coords.lng,
                        });
                      }}
                      placeholder='Select country'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location.coordinates'
              render={({ field }) => (
                <FormItem>
                  <div className='mb-6'>
                    <LocationMap
                      center={[field.value.lat, field.value.lng]}
                      zoom={
                        getCountryCoordinates(
                          form.control._getWatch('location.country') || 'US'
                        ).zoom
                      }
                      onLocationSelect={(lat: number, lng: number) => {
                        field.onChange({ lat, lng });
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location.address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter street address' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location.city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter city' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location.state'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter state' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type='submit' className='w-full'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
