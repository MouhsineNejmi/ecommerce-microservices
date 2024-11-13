import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-background'>
      <div className='text-center'>
        <Loader2 className='h-12 w-12 animate-spin text-primary mx-auto' />
        <p className='mt-4 text-lg font-medium text-muted-foreground'>
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
