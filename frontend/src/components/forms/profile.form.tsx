'use client';

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
import { ProfileUploader } from '@/components/profile-uploader';

import { useRequest } from '@/hooks/use-request';
import { toast } from '@/hooks/use-toast';

import {
  UpdateProfileType,
  updateProfileSchema,
} from '@/schemas/profile.schema';
import { User } from '@/types/user';

interface ProfileFormProps {
  user: User;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const { execute: updateProfile, loading: isUpdatingProfile } = useRequest({
    url: `/api/users/profile`,
    method: 'put',
  });

  const form = useForm<UpdateProfileType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { avatar: user.avatar, name: user.name },
  });

  const onSubmit = async (values: UpdateProfileType) => {
    const profileData = {
      avatar: values.avatar,
      name: values.name,
    };

    try {
      await updateProfile({ data: profileData });

      toast({ title: 'Profile updated successfully!' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({ title: 'Something went wrong.', variant: 'destructive' });
    }
  };

  const disabled = isUpdatingProfile || !form.getValues('avatar');

  return (
    <>
      <Heading
        title='Update Profile'
        description='You can update profile here'
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full mt-8 space-y-8'
        >
          <FormField
            control={form.control}
            name='avatar'
            render={() => (
              <FormItem>
                <FormControl>
                  <ProfileUploader
                    image={user.avatar!}
                    onChange={(value: string) => form.setValue('avatar', value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isUpdatingProfile} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={disabled} className='ml-auto' type='submit'>
            Update Profile
          </Button>
        </form>
      </Form>
    </>
  );
};
