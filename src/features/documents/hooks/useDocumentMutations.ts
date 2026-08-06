import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsRepository } from '../repository/documentsRepository';
import { useDocumentsStore } from '../store/documentsStore';
import type {
  DocumentUpdatePayload,
  DocumentSharePayload,
} from '../types';

const MUTATION_QUERY_KEY = ['documents', 'mutate'];

export const useDocumentMutations = () => {
  const queryClient = useQueryClient();
  const { setError } = useDocumentsStore();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  const update = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: ({ id, data }: { id: number | string; data: DocumentUpdatePayload }) =>
      documentsRepository.updateDocument(id, data),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Update failed');
    },
  });

  const remove = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: (id: number | string) => documentsRepository.deleteDocument(id),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Delete failed');
    },
  });

  const move = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: ({ id, parentId }: { id: number | string; parentId: number | null }) =>
      documentsRepository.moveDocument(id, parentId),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Move failed');
    },
  });

  const copy = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: ({ id, parentId }: { id: number | string; parentId: number | null }) =>
      documentsRepository.copyDocument(id, parentId),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Copy failed');
    },
  });

  const share = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: { visibility: 'private' | 'shared' | 'public'; expires_in?: number };
    }) => documentsRepository.shareDocument(id, payload),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Share failed');
    },
  });

  const toggleFavorite = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: (id: number | string) => documentsRepository.toggleFavorite(id),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Favorite toggle failed');
    },
  });

  const archive = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: (id: number | string) => documentsRepository.archiveDocument(id),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Archive failed');
    },
  });

  const restore = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: (id: number | string) => documentsRepository.restoreDocument(id),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Restore failed');
    },
  });

  const bulkDelete = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: (ids: (number | string)[]) => documentsRepository.bulkDelete(ids),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Bulk delete failed');
    },
  });

  const bulkMove = useMutation({
    mutationKey: MUTATION_QUERY_KEY,
    mutationFn: ({ ids, parentId }: { ids: (number | string)[]; parentId: number | null }) =>
      documentsRepository.bulkMove(ids, parentId),
    onSuccess: invalidate,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Bulk move failed');
    },
  });

  return {
    update,
    remove,
    move,
    copy,
    share,
    toggleFavorite,
    archive,
    restore,
    bulkDelete,
    bulkMove,
  };
};
