import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';
import { buildingsRepository } from '../repository/buildingsRepository';
import { useBuildingsStore } from '../store/buildingsStore';
import type { Building, BuildingCreatePayload, BuildingFilters, BuildingUpdatePayload } from '../types/buildings';

const BUILDINGS_QUERY_KEY = (userId: number | string, filters?: BuildingFilters) => ['owner', userId, 'buildings', 'list', filters];
const BUILDING_DETAIL_QUERY_KEY = (userId: number | string, buildingId: number | string) => ['owner', userId, 'building', buildingId];

export const useBuildings = (userId?: number | string, filters?: BuildingFilters) => {
  const queryClient = useQueryClient();
  const { setError } = useBuildingsStore();
  const ownerId = userId || 'current';

  const { data, isLoading, isFetching, error, refetch } = useQuery<Building[]>({
    queryKey: BUILDINGS_QUERY_KEY(ownerId, filters),
    queryFn: async () => {
      const result = await buildingsRepository.fetchBuildings(filters);
      useBuildingsStore.getState().cacheBuildings(result);
      return result;
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
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY(ownerId) });
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY(ownerId) });
      queryClient.invalidateQueries({ queryKey: BUILDING_DETAIL_QUERY_KEY(ownerId, variables.id) });
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
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY(ownerId) });
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
    createBuildingAsync: createMutation.mutateAsync,
    updateBuilding: updateMutation.mutate,
    updateBuildingAsync: updateMutation.mutateAsync,
    deleteBuilding: deleteMutation.mutate,
    deleteBuildingAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
