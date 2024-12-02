'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
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
import { ImageUploader } from '../image-uploader';

import { useRequest } from '@/hooks/use-request';
import { toast } from '@/hooks/use-toast';

import {
  createListingSchema,
  ListingSchemaType,
} from '@/schemas/listing.schema';

import { Category } from '@/types/category';
import { Amenity } from '@/types/amenity';
import { Listing, ListingStatus } from '@/types/listings';

interface ListingFormProps {
  initialData: Listing | null;
  categories: Category[];
  amenities: Amenity[];
}

export const ListingForm = ({
  initialData,
  categories,
  amenities,
}: ListingFormProps) => {
  const { listingId } = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<{ url: string; caption: string }[]>(
    initialData?.images || []
  );

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
          description: '',
          price: {
            basePrice: 0,
            cleaningFee: 0,
            serviceFee: 0,
          },
          location: {
            address: '',
            city: '',
            state: '',
            country: '',
            coordinates: { lat: 0, lng: 0 },
          },
          category: '',
          maxGuests: 1,
          bedrooms: 1,
          beds: 1,
          baths: 1,
          amenities: [],
        },
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

      router.push(`/office/listings`);
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
      router.push(`/office/listings`);
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

  const loading = isCreatingListing || isEditingListing || isDeletingListing;

  return (
    <>
      <Heading title={title} description={description} />

      {initialData && (
        <>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => setIsModalOpen(true)}
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
                    onChange={handleImageChange}
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
                  <TiptapEditor name='description' />
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
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a status' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ListingStatus).map((status, index) => (
                        <SelectItem key={index} value={status}>
                          <span className='flex items-center gap-2'>
                            {status}
                          </span>
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
                    onChange={(e) => {
                      const value =
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value);
                      onChange(value);
                    }}
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
                    onChange={(e) => {
                      const value =
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value);
                      onChange(value);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <div className='grid md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='location.address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
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

            <FormField
              control={form.control}
              name='location.country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter country' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Coordinates */}
          <div className='grid md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='location.coordinates.lat'
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.000001'
                      placeholder='Enter latitude'
                      onChange={(e) => {
                        const value =
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value);
                        onChange(value);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location.coordinates.lng'
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.000001'
                      placeholder='Enter longitude'
                      onChange={(e) => {
                        const value =
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value);
                        onChange(value);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price */}
          <div className='grid md:grid-cols-3 gap-4'>
            <FormField
              control={form.control}
              name='price.basePrice'
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter base price'
                      onChange={(e) => {
                        const value =
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value);
                        onChange(value);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price.cleaningFee'
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Cleaning Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter cleaning price'
                      onChange={(e) => {
                        const value =
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value);
                        onChange(value);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price.serviceFee'
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Service Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter service price'
                      onChange={(e) => {
                        const value =
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value);
                        onChange(value);
                      }}
                      {...field}
                    />
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
