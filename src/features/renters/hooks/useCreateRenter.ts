import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { RenterCreatePayload } from '../types/renters';

export const useCreateRenter = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: RenterCreatePayload) => rentersRepository.createRenter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renters', 'list'] });
    },
  });

  const createRenter = useCallback(
    async (data: RenterCreatePayload) => {
      await mutation.mutateAsync(data);
    },
    [mutation]
  );

  return {
    createRenter,
    isCreating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};
