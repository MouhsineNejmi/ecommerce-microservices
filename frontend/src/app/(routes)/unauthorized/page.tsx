import Link from 'next/link';
import { XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

const UnauthorizedPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-center space-y-6'>
        <XCircle className='w-16 h-16 text-destructive mx-auto' />
        <h1 className='text-4xl font-bold text-foreground'>
          Unauthorized Access
        </h1>
        <p className='text-xl text-muted-foreground max-w-md'>
          Sorry, you don&apos;t have permission to access this page.
        </p>
        <Button asChild>
          <Link href='/'>Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
