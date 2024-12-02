'use client';

import { useActionState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { register } from '@/actions/auth.actions';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
};

export const RegisterForm = () => {
  const [state, signInAction, isPending] = useActionState(
    register,
    INITIAL_STATE
  );

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Create an account to start listing your properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={signInAction} className='flex flex-col gap-4'>
          {state?.data && (
            <div className='flex items-center gap-2 bg-green-50 p-2 rounded'>
              <CheckCircle className='h-4 w-4 text-green-500' />
              <p className='text-green-500'>Registered successfully!</p>
            </div>
          )}

          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              type='text'
              id='name'
              name='name'
              placeholder='John Doe'
              aria-invalid={state.errors?.name ? 'true' : 'false'}
            />
            {state.errors?.name && (
              <p className='text-red-500 text-sm mt-1' role='alert'>
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              name='email'
              placeholder='test@test.com'
              aria-invalid={state.errors?.email ? 'true' : 'false'}
            />
            {state.errors?.email && (
              <p className='text-red-500 text-sm mt-1' role='alert'>
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor='password'>Password</Label>
            <Input
              type='password'
              id='password'
              name='password'
              placeholder='********'
              aria-invalid={state.errors?.password ? 'true' : 'false'}
            />
            {state.errors?.password && (
              <p className='text-red-500 text-sm mt-1' role='alert'>
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {typeof state.errors === 'string' && (
            <div
              className='bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded'
              role='alert'
            >
              {state.errors}
            </div>
          )}

          {Array.isArray(state.errors) &&
            state.errors.map((error: { message: string }, index: number) => (
              <div
                key={index}
                className='bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded'
                role='alert'
              >
                {error.message}
              </div>
            ))}

          <Button disabled={isPending} type='submit' className='w-full'>
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
