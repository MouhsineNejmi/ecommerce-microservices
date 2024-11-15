import axios from 'axios';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';

interface UseRequestProps {
  url: string;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
}

interface ApiError {
  message: string;
  field?: string;
}

export const useRequest = ({ url, method }: UseRequestProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<React.ReactNode | null>(null);

  const execute = async <T,>(data?: unknown): Promise<T | React.ReactNode> => {
    try {
      setLoading(true);
      setErrors(null);
      const response = await axios<T>({
        method,
        url,
        data,
        withCredentials: true,
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrors(
        <div className='flex items-center gap-4 bg-red-300 p-2 rounded-md text-sm'>
          <TriangleAlert className='text-red-500' />
          <ul>
            {err?.response?.data?.errors?.map((err: ApiError) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, errors };
};
