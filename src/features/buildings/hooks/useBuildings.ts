import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';
import { buildingsRepository } from '../repository/buildingsRepository';
import { useBuildingsStore } from '../store/buildingsStore';
import type { BuildingCreatePayload, BuildingUpdatePayload } from '../types/buildings';

const BUILDINGS_QUERY_KEY = ['buildings'];

export const useBuildings = (params?: {
  search?: string;
  city?: string;
  state?: string;
  country?: string;
  ordering?: string;
}) => {
  const queryClient = useQueryClient();
  const { setBuildings, setError } = useBuildingsStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: BUILDINGS_QUERY_KEY,
    queryFn: async () => {
      const result = await buildingsRepository.fetchBuildings(params);
      const list = Array.isArray(result) ? result : result.results || [];
      useBuildingsStore.getState().cacheBuildings(list);
      return list;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
    initialData: () => {
      const cached = useBuildingsStore.getState().buildings;
      return cached.length > 0 ? cached : undefined;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: BuildingCreatePayload) => buildingsRepository.createBuilding(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
      showMessage({ message: 'Building created successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to create building';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: BuildingUpdatePayload }) =>
      buildingsRepository.updateBuilding(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
      showMessage({ message: 'Building updated successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to update building';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => buildingsRepository.deleteBuilding(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
      showMessage({ message: 'Building deleted successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to delete building';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      const message = err?.message || 'Failed to refresh buildings';
      setError(message);
    }
  }, [refetch, setError]);

  return {
    buildings: data || [],
    isLoading,
    isFetching,
    error: error?.message || null,
    refresh,
    createBuilding: createMutation.mutate,
    updateBuilding: updateMutation.mutate,
    deleteBuilding: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
