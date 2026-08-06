import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import { useRentersStore } from '../store/rentersStore';
import type { Renter, RenterAssignUnitPayload, RenterTransferUnitPayload } from '../types/renters';

const RENTER_QUERY_KEY = (id: number | string) => ['renters', 'detail', id];

export const useRenter = (id: number | string) => {
  const queryClient = useQueryClient();
  const { setError } = useRentersStore();

  const { data, isLoading, error } = useQuery<Renter>({
    queryKey: RENTER_QUERY_KEY(id),
    queryFn: () => rentersRepository.fetchRenter(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to load renter');
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_QUERY_KEY(id) });
  }, [id, queryClient]);

  const deleteMutation = useMutation({
    mutationFn: () => rentersRepository.deleteRenter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renters', 'list'] });
    },
  });

  const deleteRenter = useCallback(async () => {
    await deleteMutation.mutateAsync();
  }, [deleteMutation]);

  const rateMutation = useMutation({
    mutationFn: (args: { rating: number; review?: string }) =>
      rentersRepository.rateRenter(id, args.rating, args.review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENTER_QUERY_KEY(id) });
    },
  });

  const rate = useCallback(
    async (rating: number, review?: string) => {
      await rateMutation.mutateAsync({ rating, review });
    },
    [rateMutation]
  );

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => rentersRepository.updateRenterStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENTER_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: ['renters', 'list'] });
    },
  });

  const updateStatus = useCallback(
    async (status: string) => {
      await updateStatusMutation.mutateAsync(status);
    },
    [updateStatusMutation]
  );

  const vacateMutation = useMutation({
    mutationFn: (end_date?: string) => rentersRepository.vacateRenter(id, end_date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENTER_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: ['renters', 'list'] });
    },
  });

  const vacate = useCallback(
    async (end_date?: string) => {
      await vacateMutation.mutateAsync(end_date);
    },
    [vacateMutation]
  );

  const assignUnitMutation = useMutation({
    mutationFn: (payload: RenterAssignUnitPayload) => rentersRepository.assignUnit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENTER_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: ['renters', 'list'] });
    },
  });

  const assignUnit = useCallback(
    async (payload: RenterAssignUnitPayload) => {
      await assignUnitMutation.mutateAsync(payload);
    },
    [assignUnitMutation]
  );

  const transferUnitMutation = useMutation({
    mutationFn: (payload: RenterTransferUnitPayload) => rentersRepository.transferUnit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENTER_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: ['renters', 'list'] });
    },
  });

  const transferUnit = useCallback(
    async (payload: RenterTransferUnitPayload) => {
      await transferUnitMutation.mutateAsync(payload);
    },
    [transferUnitMutation]
  );

  return {
    renter: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    deleteRenter,
    isDeleting: deleteMutation.isPending,
    rate,
    isRating: rateMutation.isPending,
    updateStatus,
    isUpdatingStatus: updateStatusMutation.isPending,
    vacate,
    isVacating: vacateMutation.isPending,
    assignUnit,
    isAssigningUnit: assignUnitMutation.isPending,
    transferUnit,
    isTransferringUnit: transferUnitMutation.isPending,
  };
};
