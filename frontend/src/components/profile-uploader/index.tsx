import React from 'react';
import { ImageDropzone } from './image-dropzone';
import { useImageUpload } from '@/hooks/use-image-upload';

interface ProfileUploaderProps {
  image: string;
  onChange: (value: string) => void;
}

export const ProfileUploader = ({ image, onChange }: ProfileUploaderProps) => {
  const { imageUrl, isUploading, error, handleImageSelect, removeImage } =
    useImageUpload(image);

  const handleImageUpload = async (file: File) => {
    const uploadedUrl = await handleImageSelect(file);
    onChange(uploadedUrl);
  };

  const handleRemoveImage = () => {
    removeImage();
    onChange('');
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <h2 className='text-2xl font-semibold text-gray-900'>Profile Picture</h2>
      <div className={`relative ${isUploading ? 'opacity-50' : ''}`}>
        <ImageDropzone
          onImageSelect={handleImageUpload}
          imageUrl={imageUrl}
          onRemove={handleRemoveImage}
        />
        {isUploading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/50 rounded-full'>
            <div className='w-8 h-8 border-4 border-gray-300 border-primary rounded-full animate-spin' />
          </div>
        )}
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
      <p className='text-sm text-gray-500'>
        Supported formats: JPG, PNG, GIF (max. 5MB)
      </p>
    </div>
  );
};
