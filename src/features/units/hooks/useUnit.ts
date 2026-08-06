import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { unitsRepository } from '../repository/unitsRepository';
import { useUnitsStore } from '../store/unitsStore';
import type { Unit } from '../types/units';

const UNIT_QUERY_KEY = (id: number | string) => ['unit', id];

export const useUnit = (id: number | string) => {
  const queryClient = useQueryClient();
  const { setSelectedUnit, setError } = useUnitsStore();

  const { data, isLoading, error, refetch } = useQuery<Unit>({
    queryKey: UNIT_QUERY_KEY(id),
    queryFn: () => unitsRepository.fetchUnit(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      useUnitsStore.getState().setSelectedUnit(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to load unit');
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: UNIT_QUERY_KEY(id) });
  }, [id, queryClient]);

  const deleteMutation = useMutation({
    mutationFn: () => unitsRepository.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units', 'list'] });
    },
  });

  const deleteUnit = useCallback(async () => {
    await deleteMutation.mutateAsync();
  }, [deleteMutation]);

  return {
    unit: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    deleteUnit,
    isDeleting: deleteMutation.isPending,
  };
};
