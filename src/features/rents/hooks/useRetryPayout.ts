import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rentsRepository } from '../repository/rentsRepository';

export const useRetryPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => rentsRepository.retryPayout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rents'] });
    },
  });
};
