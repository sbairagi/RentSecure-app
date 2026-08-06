import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { documentsRepository } from '../repository/documentsRepository';
import { useDocumentsStore } from '../store/documentsStore';
import type { DocumentCreatePayload, DocumentUploadProgress } from '../types';

const UPLOAD_QUERY_KEY = ['documents', 'upload'];

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { setUploadProgress, setError } = useDocumentsStore();
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: upload, isPending } = useMutation({
    mutationKey: UPLOAD_QUERY_KEY,
    mutationFn: async (payload: DocumentCreatePayload) => {
      setIsUploading(true);
      setUploadProgress({
        loaded: 0,
        total: 100,
        progress: 0,
        status: 'uploading',
      });

      return documentsRepository.uploadDocument(
        payload.file,
        (progress) => {
          setUploadProgress({
            loaded: progress,
            total: 100,
            progress,
            status: progress < 100 ? 'uploading' : 'processing',
          });
        }
      );
    },
    onSuccess: () => {
      setUploadProgress({
        loaded: 100,
        total: 100,
        progress: 100,
        status: 'complete',
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      setUploadProgress({
        loaded: 0,
        total: 100,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      });
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
    isPending,
    resetProgress,
  };
};
