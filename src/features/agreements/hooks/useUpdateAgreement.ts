import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { agreementsRepository } from '../repository/agreementsRepository';
import type { AgreementUpdatePayload } from '../types/agreements';

export const useUpdateAgreement = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: AgreementUpdatePayload }) =>
      agreementsRepository.updateAgreement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements', 'list'] });
    },
  });

  const updateAgreement = useCallback(
    async (id: number | string, data: AgreementUpdatePayload) => {
      await mutation.mutateAsync({ id, data });
    },
    [mutation]
  );

  return {
    updateAgreement,
    isUpdating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
};
