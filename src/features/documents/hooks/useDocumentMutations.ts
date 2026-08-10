import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsRepository } from '../repository/documentsRepository';
import { useDocumentsStore } from '../store/documentsStore';

export const useDocumentMutations = () => {
  const queryClient = useQueryClient();
  const { setError } = useDocumentsStore();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  const remove = useMutation({
    mutationKey: ['documents', 'delete'],
    mutationFn: (id: number | string) => documentsRepository.deleteDocument(id),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Delete failed');
    },
  });

  return {
    remove,
  };
};

export const useImageMutations = () => {
  const queryClient = useQueryClient();
  const { setError } = useDocumentsStore();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['images'] });
  };

  const remove = useMutation({
    mutationKey: ['images', 'delete'],
    mutationFn: (id: number | string) => documentsRepository.deleteImage(id),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Delete failed');
    },
  });

  return {
    remove,
  };
};
