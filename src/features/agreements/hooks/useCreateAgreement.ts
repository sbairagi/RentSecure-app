import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { agreementsRepository } from '../repository/agreementsRepository';
import type { AgreementCreatePayload } from '../types/agreements';

export const useCreateAgreement = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AgreementCreatePayload) => agreementsRepository.createAgreement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements', 'list'] });
    },
  });

  const createAgreement = useCallback(
    async (data: AgreementCreatePayload) => {
      await mutation.mutateAsync(data);
    },
    [mutation]
  );

  return {
    createAgreement,
    isCreating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};
