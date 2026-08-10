import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rentsRepository } from '../repository/rentsRepository';
import type { RentRecordCreatePayload } from '../types/rents';

const RENT_RECORDS_QUERY_KEY = (params?: any) => ['rents', 'list', params];

export const useCreateRentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RentRecordCreatePayload) => rentsRepository.createRentRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rents'] });
    },
  });
};
