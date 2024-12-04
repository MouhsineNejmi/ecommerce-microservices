'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from '@/hooks/use-toast';
import { useRequest } from '@/hooks/use-request';

import { User } from '@/types/user';

type UseFavoriteProps = {
  currentUser?: User | null;
  listingId: string;
};

export const useFavorites = ({ currentUser, listingId }: UseFavoriteProps) => {
  const router = useRouter();
  const { execute: removeFromFavorites, loading: isRemovingFromFavorites } =
    useRequest({ method: 'delete', url: '/api/users/favorites' });
  const { execute: addToFavorites, loading: isAddingToFavorites } = useRequest({
    method: 'post',
    url: '/api/users/favorites',
  });

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favorites || [];
    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        router.push('/login');
      }

      try {
        if (hasFavorited) {
          await removeFromFavorites({ urlParams: listingId });
          toast({ title: 'Listing removed from favorites successfully' });
        } else {
          await addToFavorites({ urlParams: listingId });
          toast({ title: 'Listing added to favorites successfully' });
        }

        router.refresh();
      } catch {
        toast({
          title: 'Something went wrong! Please try again later.',
          variant: 'destructive',
        });
      }
    },
    [
      addToFavorites,
      currentUser,
      hasFavorited,
      listingId,
      removeFromFavorites,
      router,
    ]
  );

  return {
    hasFavorited,
    toggleFavorite,
    loading: isRemovingFromFavorites || isAddingToFavorites,
  };
};
