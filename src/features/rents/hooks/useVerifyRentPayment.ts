import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rentsRepository } from '../repository/rentsRepository';
import type { VerifyRentPaymentPayload } from '../types/rents';

export const useVerifyRentPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyRentPaymentPayload) => rentsRepository.verifyPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rents'] });
    },
  });
};
