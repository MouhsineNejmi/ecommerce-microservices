import { Heart } from 'lucide-react';

type HeartButtonProps = {
  listingId: string;
  // currentUser?: IUser | null;
};

export const HeartButton: React.FC<HeartButtonProps> = (
  {
    // listingId,
    // currentUser,
  }
) => {
  // const { hasFavorited, toggleFavorite } = useFavorite({
  //   currentUser,
  //   listingId,
  // });

  return (
    <button
      // onClick={toggleFavorite}
      className='relative w-8 h-8 bg-white/70 rounded-full flex items-center justify-center shadow-sm hover:opacity-80 transition cursor-pointer'
    >
      <Heart
        size={18}
        // className={hasFavorited && 'fill-rose-600'}
        // className='fill-rose-600'
      />
    </button>
  );
};
