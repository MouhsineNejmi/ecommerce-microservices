import { redirect } from 'next/navigation';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { getCurrentUser } from '@/actions/get-current-user';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  if (!user || 'errors' in user) {
    redirect('/login');
  }

  if (user && user.role !== 'admin') {
    redirect('/unauthorized');
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
