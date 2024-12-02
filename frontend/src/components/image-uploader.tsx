'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { X, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ListingImage {
  url: string;
  caption: string;
}

interface ImageUploadProps {
  initialImages?: ListingImage[];
  onChange: (images: ListingImage[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  initialImages = [],
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [images, setImages] = useState<ListingImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (input?.files) {
      const filesArray = Array.from(input.files);

      if (images.length + filesArray.length > maxImages) {
        toast({
          title: `Maximum ${maxImages} images allowed`,
          variant: 'destructive',
        });
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...filesArray]);
      setPreviewImages((prevPreviews) => [
        ...prevPreviews,
        ...filesArray.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemovePreviewImage = (indexToRemove: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(indexToRemove, 1);
      return updatedFiles;
    });

    setPreviewImages((prevPreviews) => {
      const updatedPreviews = [...prevPreviews];
      updatedPreviews.splice(indexToRemove, 1);
      return updatedPreviews;
    });
  };

  const handleRemoveUploadedImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const updateImageCaption = (index: number, caption: string) => {
    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, caption } : img
    );
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'elevate-x');

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return {
          url: response.data.secure_url,
          caption: file.name,
        };
      });

      const newImages = await Promise.all(uploadPromises);
      const updatedImages = [...images, ...newImages].slice(0, maxImages);

      setImages(updatedImages);
      onChange(updatedImages);
      setFiles([]);
      setPreviewImages([]);
      setIsUploading(false);
    } catch {
      toast({
        title: 'Upload failed. Please try again.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <label
        htmlFor='imageUpload'
        className={`
          cursor-pointer 
          border-2 border-dashed 
          p-6 
          flex flex-col 
          items-center 
          justify-center 
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          id='imageUpload'
          type='file'
          multiple
          accept='image/*'
          className='hidden'
          onChange={handleImageChange}
          disabled={images.length >= maxImages}
        />
        <ImagePlus className='text-gray-500' size={32} />
        <span className='text-gray-500 mt-2'>
          {images.length >= maxImages
            ? 'Max images reached'
            : 'Click to upload images'}
        </span>
      </label>

      {previewImages.length > 0 && (
        <div>
          <h4 className='text-md font-semibold mb-2'>Preview Images:</h4>
          <div className='flex gap-4 overflow-x-auto'>
            {previewImages.map((preview, index) => (
              <div key={index} className='relative'>
                <Image
                  src={preview}
                  alt='Preview'
                  width={120}
                  height={120}
                  className='object-cover rounded'
                />
                <button
                  type='button'
                  onClick={() => handleRemovePreviewImage(index)}
                  className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1'
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <Button
            type='button'
            onClick={handleUpload}
            disabled={isUploading}
            className='mt-2'
          >
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <h4 className='text-md font-semibold mb-2'>Uploaded Images:</h4>
          <div className='grid grid-cols-3 gap-4'>
            {images.map((image, index) => (
              <div key={index} className='relative'>
                <Image
                  src={image.url}
                  alt='Uploaded image'
                  width={200}
                  height={200}
                  className='object-cover rounded aspect-square'
                />
                <input
                  type='text'
                  placeholder='Image caption'
                  value={image.caption}
                  onChange={(e) => updateImageCaption(index, e.target.value)}
                  className='w-full p-2 border rounded mt-2'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveUploadedImage(index)}
                  className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1'
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='text-sm text-gray-500'>
        {images.length} / {maxImages} images
      </div>
    </div>
  );
}
