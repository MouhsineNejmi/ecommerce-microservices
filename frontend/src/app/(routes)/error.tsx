'use client';

import { useEffect, useState } from 'react';
import { ErrorDisplay } from '@/components/error-display';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    console.error(error);
    setMessage(error.message);
  }, [error]);

  return <ErrorDisplay message={message} reset={reset} />;
}
