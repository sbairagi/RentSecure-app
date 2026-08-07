import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';
import { caretakersRepository } from '../repository/caretakersRepository';
import { useCaretakersStore } from '../store/caretakersStore';
import type { Caretaker, CaretakerCreatePayload, CaretakerFilters, CaretakerUpdatePayload } from '../types/caretakers';

const CARETAKERS_QUERY_KEY = ['caretakers'];

export const useCaretakers = (params?: CaretakerFilters) => {
  const queryClient = useQueryClient();
  const { setError } = useCaretakersStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: CARETAKERS_QUERY_KEY,
    queryFn: async () => {
      const result = await caretakersRepository.fetchCaretakers(params);
      const list: Caretaker[] = Array.isArray(result) ? result : result.results || [];
      useCaretakersStore.getState().cacheCaretakers(list);
      return list;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
    initialData: () => {
      const cached = useCaretakersStore.getState().caretakers;
      return cached.length > 0 ? cached : undefined;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: CaretakerCreatePayload) =>
      caretakersRepository.createCaretaker(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARETAKERS_QUERY_KEY });
      showMessage({ message: 'Caretaker created successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to create caretaker';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: CaretakerUpdatePayload }) =>
      caretakersRepository.updateCaretaker(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARETAKERS_QUERY_KEY });
      showMessage({ message: 'Caretaker updated successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to update caretaker';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => caretakersRepository.deleteCaretaker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARETAKERS_QUERY_KEY });
      showMessage({ message: 'Caretaker deleted successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to delete caretaker';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number | string) => caretakersRepository.deactivateCaretaker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARETAKERS_QUERY_KEY });
      showMessage({ message: 'Caretaker deactivated successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to deactivate caretaker';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      const message = err?.message || 'Failed to refresh caretakers';
      setError(message);
    }
  }, [refetch, setError]);

  return {
    caretakers: data || [],
    isLoading,
    isFetching,
    error: error?.message || null,
    refresh,
    createCaretaker: createMutation.mutate,
    updateCaretaker: updateMutation.mutate,
    deleteCaretaker: deleteMutation.mutate,
    deactivateCaretaker: deactivateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
  };
};

export const useCaretaker = (id: number | string) => {
  const queryClient = useQueryClient();
  const { setError } = useCaretakersStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['caretaker', id],
    queryFn: async () => {
      const result = await caretakersRepository.fetchCaretaker(id);
      useCaretakersStore.getState().setSelectedCaretaker(result);
      return result;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
    initialData: () => {
      const cached = useCaretakersStore.getState().selectedCaretaker;
      return cached?.id === id ? cached : undefined;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id: caretakerId, payload }: { id: number | string; payload: any }) =>
      caretakersRepository.updateCaretaker(caretakerId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['caretaker', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['caretakers'] });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to update caretaker';
      setError(message);
    },
  });

  const deleteMutationCaretaker = useMutation({
    mutationFn: (id: number | string) => caretakersRepository.deleteCaretaker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caretaker', id] });
      queryClient.invalidateQueries({ queryKey: ['caretakers'] });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to delete caretaker';
      setError(message);
    },
  });

  const deactivateMutationCaretaker = useMutation({
    mutationFn: (id: number | string) => caretakersRepository.deactivateCaretaker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caretaker', id] });
      queryClient.invalidateQueries({ queryKey: ['caretakers'] });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to deactivate caretaker';
      setError(message);
    },
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      const message = err?.message || 'Failed to refresh caretaker';
      setError(message);
    }
  }, [refetch, setError]);

  return {
    caretaker: data || null,
    isLoading,
    error: error?.message || null,
    refresh,
    updateCaretaker: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteCaretaker: deleteMutationCaretaker.mutate,
    deactivateCaretaker: deactivateMutationCaretaker.mutate,
    isDeleting: deleteMutationCaretaker.isPending,
    isDeactivating: deactivateMutationCaretaker.isPending,
  };
};
