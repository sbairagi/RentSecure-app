import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rentsRepository } from '../repository/rentsRepository';
import type { CreateRentPaymentPayload } from '../types/rents';

export const useCreateRentPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRentPaymentPayload) => rentsRepository.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rents'] });
    },
  });
};
