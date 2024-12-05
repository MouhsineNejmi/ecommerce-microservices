import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { TriangleAlert } from 'lucide-react';

const API_BASE_URL = 'http://localhost:4000';

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

  const execute = async <T,>(params?: {
    urlParams?: string;
    data?: unknown;
  }): Promise<T | React.ReactNode> => {
    try {
      setLoading(true);
      setErrors(null);

      const dynamicUrl = `${API_BASE_URL}${url}${
        params?.urlParams ? `/${params.urlParams}` : ''
      }`;

      const response = await axios<T>({
        method,
        url: dynamicUrl,
        data: params?.data,
        withCredentials: true,
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err instanceof AxiosError) {
        setErrors(
          <div className='flex items-center gap-4 bg-red-300 p-2 rounded-md text-sm text-red-500'>
            <TriangleAlert />
            <ul>
              {err?.response?.data?.errors?.map((err: ApiError) => (
                <li key={err.message}>{err.message}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        setErrors(
          <div className='flex items-center gap-4 bg-red-300 text-red-500 p-2 rounded-md text-sm'>
            <TriangleAlert className='text-red-500' />
            <p>Something went wrong! Please try again later.</p>
          </div>
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, errors };
};
