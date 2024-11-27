'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import Loader from '@/components/loader';

import { useAuthContext } from '@/providers/auth.provider';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

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

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className='flex-1 p-4'>
        <div className='mb-4'>
          <SidebarTrigger>
            <Button variant='outline' size='icon'>
              <Menu className='h-4 w-4' />
              <span className='sr-only'>Toggle Sidebar</span>
            </Button>
          </SidebarTrigger>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
