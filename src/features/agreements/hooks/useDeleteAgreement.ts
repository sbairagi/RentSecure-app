import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { agreementsRepository } from '../repository/agreementsRepository';

export const useDeleteAgreement = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number | string) => agreementsRepository.deleteAgreement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements', 'list'] });
    },
  });

  const deleteAgreement = useCallback(
    async (id: number | string) => {
      await mutation.mutateAsync(id);
    },
    [mutation]
  );

  return {
    deleteAgreement,
    isDeleting: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};
