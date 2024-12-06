import axios from 'axios';
import { useState, useCallback } from 'react';
import { toast } from './use-toast';

export const useImageUpload = (image: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(image);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File): Promise<string> => {
    setError(null);
    setIsUploading(true);

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setIsUploading(false);
      return '';
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'elevate-x');

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setImageUrl(response.data.secure_url);
      return response.data.secure_url;
    } catch {
      toast({
        title: 'Upload failed. Please try again.',
        variant: 'destructive',
      });
      setImageUrl(null);
      return '';
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removeImage = useCallback(() => {
    setImageUrl(null);
    setError(null);
  }, []);

  return {
    imageUrl,
    isUploading,
    error,
    handleImageSelect,
    removeImage,
  };
};
