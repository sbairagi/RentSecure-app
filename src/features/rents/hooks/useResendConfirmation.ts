import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rentsRepository } from '../repository/rentsRepository';

export const useResendConfirmation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => rentsRepository.resendConfirmation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rents'] });
    },
  });
};
