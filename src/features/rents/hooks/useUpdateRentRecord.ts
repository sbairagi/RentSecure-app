import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rentsRepository } from '../repository/rentsRepository';
import type { RentRecordUpdatePayload } from '../types/rents';

export const useUpdateRentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: RentRecordUpdatePayload }) =>
      rentsRepository.updateRentRecord(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rents', 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['rents', 'list'] });
    },
  });
};
