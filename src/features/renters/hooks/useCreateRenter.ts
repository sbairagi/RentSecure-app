import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import { queryKeys } from '@/providers/queryClient';
import type { Renter, RenterCreatePayload } from '../types/renters';

export const useCreateRenter = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Renter, Error, RenterCreatePayload>({
    mutationFn: (data: RenterCreatePayload) => rentersRepository.createRenter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.renters.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.renters.statusSummary });
    },
  });

  const createRenter = useCallback(
    async (data: RenterCreatePayload): Promise<Renter> => {
      return mutation.mutateAsync(data);
    },
    [mutation]
  );

  return {
    createRenter,
    isCreating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};