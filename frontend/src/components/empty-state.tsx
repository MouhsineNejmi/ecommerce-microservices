'use client';

import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Exact Matches',
  subtitle = 'Try changing or removing some of your filters',
  showReset,
  action,
}) => {
  return (
    <div className='h-[60vh] w-full flex flex-col gap-2 justify-center items-center text-center'>
      <Heading title={title} description={subtitle} />
      <div className='w-40 mt-4'>
        {showReset && (
          <Button variant='outline' onClick={() => redirect('/')}>
            Reset
          </Button>
        )}
      </div>
      <>{action && action}</>
    </div>
  );
};

export default EmptyState;
