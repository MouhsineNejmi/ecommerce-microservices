import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImageDropzoneProps {
  onImageSelect: (file: File) => void;
  imageUrl: string | null;
  onRemove: () => void;
}

export const ImageDropzone = ({
  onImageSelect,
  imageUrl,
  onRemove,
}: ImageDropzoneProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  return (
    <div
      className='relative w-48 h-48 rounded-full overflow-hidden group'
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {imageUrl ? (
        <div className='relative w-full h-full'>
          <Image
            src={imageUrl}
            height={100}
            width={100}
            alt='Profile'
            className='w-full h-full object-cover'
          />
          <button
            onClick={onRemove}
            className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
          >
            <X className='w-8 h-8 text-white' />
          </button>
        </div>
      ) : (
        <label className='flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors'>
          <Upload className='w-8 h-8 text-gray-400 mb-2' />
          <span className='text-sm text-gray-500'>
            Drop image here or click to upload
          </span>
          <input
            type='file'
            className='hidden'
            accept='image/*'
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );
};
