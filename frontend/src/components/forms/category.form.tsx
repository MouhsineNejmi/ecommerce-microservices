'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { AlertModal } from '../alert-modal';

import {
  CategoryAmenityType,
  CategoryAmenitySchema,
} from '@/schemas/category-amenity.schema';
import { useRequest } from '@/hooks/use-request';
import { toast } from '@/hooks/use-toast';

interface CategoryFormProps {
  initialData: CategoryAmenityType | null;
}

export const CategoryForm = ({ initialData }: CategoryFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { execute: createCategory, loading: isCreatingCategory } = useRequest({
    url: '/api/categories',
    method: 'post',
  });
  const { execute: editCategory, loading: isEditingCategory } = useRequest({
    url: `/api/categories/${params.categoryId}`,
    method: 'put',
  });
  const { execute: deleteCategory, loading: isDeletingCategory } = useRequest({
    url: `/api/categories/${params.categoryId}`,
    method: 'delete',
  });

  const title = initialData ? 'Edit category' : 'Create category';
  const description = initialData ? 'Update a category' : 'Add a new category';
  const toastMessage = initialData
    ? 'Category updated successfully!'
    : 'Category created successfully!';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<CategoryAmenityType>({
    resolver: zodResolver(CategoryAmenitySchema),
    defaultValues: initialData || {
      name: '',
      icon: '',
    },
  });

  const onSubmit = async (values: CategoryAmenityType) => {
    const categoryData = {
      name: values.name,
      icon: values.icon,
    };

    try {
      if (initialData) {
        await editCategory({ data: categoryData });
      } else {
        await createCategory({ data: categoryData });
      }

      router.push(`/office/categories`);
      toast({ title: toastMessage });
    } catch (error) {
      toast({ title: 'Something went wrong.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory();
      router.push(`/office/categories`);
      toast({ title: 'Category deleted.' });
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  const loading = isCreatingCategory || isEditingCategory || isDeletingCategory;

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
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
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full mt-8 space-y-8'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Bed, Wifi...'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='https://example.com/icon.png'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
