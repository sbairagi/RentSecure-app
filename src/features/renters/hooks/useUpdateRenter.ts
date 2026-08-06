import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { RenterUpdatePayload } from '../types/renters';

export const useUpdateRenter = (id: number | string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: RenterUpdatePayload) => rentersRepository.updateRenter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renters', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['renters', 'detail', id] });
    },
  });

  const updateRenter = useCallback(
    async (data: RenterUpdatePayload) => {
      await mutation.mutateAsync(data);
    },
    [mutation]
  );

  return {
    updateRenter,
    isUpdating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};
