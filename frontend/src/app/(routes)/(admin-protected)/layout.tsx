'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Loader from '@/components/loader';

import { useAuthContext } from '@/providers/auth.provider';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user && user.role && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loader />;
  }

  console.log('LOADING: ', loading);
  console.log('USER: ', user);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>{children}</main>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
