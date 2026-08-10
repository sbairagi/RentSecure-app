import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { documentsRepository } from '../repository/documentsRepository';
import { useDocumentsStore } from '../store/documentsStore';
import type { PickedAsset } from '../types';

const UPLOAD_QUERY_KEY = ['documents', 'upload'];

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { setUploadProgress, setError } = useDocumentsStore();
  const [isUploading, setIsUploading] = useState(false);

  const upload = useMutation({
    mutationKey: UPLOAD_QUERY_KEY,
    mutationFn: async ({ asset, unit, renter }: { asset: PickedAsset; unit: number; renter?: number | null }): Promise<any> => {
      setIsUploading(true);
      setUploadProgress({
        loaded: 0,
        total: 100,
        progress: 0,
        status: 'preparing',
      });

      const formData = documentsRepository.buildFormData(asset, unit, renter);

      try {
        const result = await documentsRepository.createDocument(
          { unit, renter, file: formData },
          (progress) => {
            setUploadProgress(progress);
          }
        );
        return result;
      } catch (error) {
        setUploadProgress({
          loaded: 0,
          total: 100,
          progress: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        });
        throw error;
      }
    },
    onSuccess: () => {
      setUploadProgress({
        loaded: 100,
        total: 100,
        progress: 100,
        status: 'complete',
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Upload failed');
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const resetProgress = () => {
    setUploadProgress(null);
  };

  return {
    upload,
    isUploading,
    resetProgress,
  };
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const { setUploadProgress, setError } = useDocumentsStore();
  const [isUploading, setIsUploading] = useState(false);

  const upload = useMutation({
    mutationKey: ['images', 'upload'],
    mutationFn: async ({ asset, unit, renter }: { asset: PickedAsset; unit: number; renter?: number | null }): Promise<any> => {
      setIsUploading(true);
      setUploadProgress({
        loaded: 0,
        total: 100,
        progress: 0,
        status: 'preparing',
      });

      const formData = documentsRepository.buildFormData(asset, unit, renter);

      try {
        const result = await documentsRepository.createImage(
          { unit, renter, file: formData },
          (progress) => {
            setUploadProgress(progress);
          }
        );
        return result;
      } catch (error) {
        setUploadProgress({
          loaded: 0,
          total: 100,
          progress: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        });
        throw error;
      }
    },
    onSuccess: () => {
      setUploadProgress({
        loaded: 100,
        total: 100,
        progress: 100,
        status: 'complete',
      });
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Upload failed');
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const resetProgress = () => {
    setUploadProgress(null);
  };

  return {
    upload,
    isUploading,
    resetProgress,
  };
};
