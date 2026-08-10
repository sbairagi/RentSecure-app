import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { buildingsRepository } from '../repository/buildingsRepository';
import { useBuildingsStore } from '../store/buildingsStore';
import type { Building } from '../types/buildings';

const BUILDING_QUERY_KEY = (userId: number | string, id: number | string) => ['owner', userId, 'building', id];

export const useBuilding = (id: number | string, userId?: number | string) => {
  const queryClient = useQueryClient();
  const { setSelectedBuilding, setError } = useBuildingsStore();
  const ownerId = userId || 'current';

  const { data, isLoading, error, refetch } = useQuery<Building>({
    queryKey: BUILDING_QUERY_KEY(ownerId, id),
    queryFn: () => buildingsRepository.fetchBuilding(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      useBuildingsStore.getState().setSelectedBuilding(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to load building');
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEY(ownerId, id) });
  }, [id, ownerId, queryClient]);

  return {
    building: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
