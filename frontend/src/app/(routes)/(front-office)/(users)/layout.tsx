import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/get-current-user';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const { data: user } = await getCurrentUser();

  if (!user || 'errors' in user) {
    redirect('/login');
  }

  if (user && user.role !== 'admin') {
    redirect('/unauthorized');
  }
  return <>{children}</>;
};

export default ProtectedLayout;
