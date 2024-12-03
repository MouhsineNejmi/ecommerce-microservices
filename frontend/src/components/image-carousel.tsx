import Image from 'next/image';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type ImageCarouselProps = {
  images: { url: string; caption: string }[];
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const isFirstImage = currentImageIndex === 0;
  const isLastImage = currentImageIndex === images.length;

  const handlePrevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isFirstImage) return;

    setCurrentImageIndex((prevIndex: number) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLastImage) return;

    setCurrentImageIndex((prevIndex: number) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className='relative w-full h-full aspect-square overflow-hidden rounded-xl'>
      <Image
        className='object-cover h-full w-full z-0 group-hover:scale-110 transition'
        width={250}
        height={250}
        src={images[currentImageIndex].url}
        alt={images[currentImageIndex].caption}
      />

      {images.length > 1 && (
        <>
          <button
            className={`
              flex justify-center items-center w-6 h-6 bg-white rounded-full shadow-md absolute left-2 top-1/2 -translate-y-1/2 z-50
              ${isFirstImage ? 'opacity-50' : 'opacity-100'}
            `}
            onClick={handlePrevClick}
          >
            <ChevronLeft />
          </button>

          <button
            className={`
              flex justify-center items-center w-6 h-6 bg-white rounded-full shadow-md absolute right-2 top-1/2 -translate-y-1/2 z-50
              ${isLastImage ? 'opacity-50' : 'opacity-100'}
            `}
            onClick={handleNextClick}
          >
            <ChevronRight />
          </button>
        </>
      )}

      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => handleDotClick(e, index)}
            className={`h-2 rounded-full bg-white transition ${
              index === currentImageIndex ? 'w-4' : 'w-2'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};
