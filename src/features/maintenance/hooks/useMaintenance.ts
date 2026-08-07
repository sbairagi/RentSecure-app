import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';
import { maintenanceRepository } from '../repository/maintenanceRepository';
import { useMaintenanceStore } from '../store/maintenanceStore';
import type { MaintenanceCommentPayload, MaintenanceCreatePayload, MaintenanceExpensePayload, MaintenanceFilters, MaintenanceUpdatePayload } from '../types/maintenance';

const MAINTENANCE_QUERY_KEY = ['maintenance'];
const MAINTENANCE_DETAIL_KEY = ['maintenance', 'detail'];

export const useMaintenance = (params?: MaintenanceFilters) => {
  const queryClient = useQueryClient();
  const { setError } = useMaintenanceStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: MAINTENANCE_QUERY_KEY,
    queryFn: async () => {
      const result = await maintenanceRepository.fetchMaintenanceRequests(params);
      const list = Array.isArray(result) ? result : result.results || [];
      useMaintenanceStore.getState().cacheRequests(list);
      return list;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
    initialData: () => {
      const cached = useMaintenanceStore.getState().requests;
      return cached.length > 0 ? cached : undefined;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: MaintenanceCreatePayload) =>
      maintenanceRepository.createMaintenanceRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
      showMessage({ message: 'Maintenance request created successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to create maintenance request';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: MaintenanceUpdatePayload }) =>
      maintenanceRepository.updateMaintenanceRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
      showMessage({ message: 'Maintenance request updated successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to update maintenance request';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => maintenanceRepository.deleteMaintenanceRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
      showMessage({ message: 'Maintenance request deleted successfully', type: 'success' });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to delete maintenance request';
      setError(message);
      showMessage({ message, type: 'danger' });
    },
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      const message = err?.message || 'Failed to refresh maintenance requests';
      setError(message);
    }
  }, [refetch, setError]);

  return {
    requests: data || [],
    isLoading,
    isFetching,
    error: error?.message || null,
    refresh,
    createMaintenanceRequest: createMutation.mutate,
    updateMaintenanceRequest: updateMutation.mutate,
    deleteMaintenanceRequest: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useMaintenanceDetail = (id: number | string) => {
  const queryClient = useQueryClient();
  const { setError } = useMaintenanceStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: MAINTENANCE_DETAIL_KEY,
    queryFn: async () => {
      const result = await maintenanceRepository.fetchMaintenanceRequest(id);
      useMaintenanceStore.getState().setSelectedRequest(result);
      return result;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
    initialData: () => {
      const cached = useMaintenanceStore.getState().selectedRequest;
      return cached?.id === id ? cached : undefined;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id: requestId, payload }: { id: number | string; payload: MaintenanceUpdatePayload }) =>
      maintenanceRepository.updateMaintenanceRequest(requestId, payload),
    onSuccess: (_: any, _variables: any) => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_DETAIL_KEY });
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to update maintenance request';
      setError(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (requestId: number | string) => maintenanceRepository.deleteMaintenanceRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_DETAIL_KEY });
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to delete maintenance request';
      setError(message);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id: requestId, data }: { id: number | string; data: { status: string; resolution_notes?: string } }) =>
      maintenanceRepository.updateStatus(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_DETAIL_KEY });
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to update status';
      setError(message);
    },
  });

  const assignCaretakerMutation = useMutation({
    mutationFn: ({ id: requestId, caretakerId }: { id: number | string; caretakerId: number }) =>
      maintenanceRepository.assignCaretaker(requestId, caretakerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_DETAIL_KEY });
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to assign caretaker';
      setError(message);
    },
  });

  const assignVendorMutation = useMutation({
    mutationFn: ({ id: requestId, vendorId }: { id: number | string; vendorId: number }) =>
      maintenanceRepository.assignVendor(requestId, vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_DETAIL_KEY });
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to assign vendor';
      setError(message);
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ id: requestId, data }: { id: number | string; data: MaintenanceCommentPayload }) =>
      maintenanceRepository.addComment(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_DETAIL_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to add comment';
      setError(message);
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: ({ id: requestId, data }: { id: number | string; data: MaintenanceExpensePayload }) =>
      maintenanceRepository.addExpense(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_DETAIL_KEY });
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to add expense';
      setError(message);
    },
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      const message = err?.message || 'Failed to refresh maintenance request';
      setError(message);
    }
  }, [refetch, setError]);

  return {
    request: data || null,
    isLoading,
    error: error?.message || null,
    refresh,
    updateMaintenanceRequest: updateMutation.mutate,
    deleteMaintenanceRequest: deleteMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    assignCaretaker: assignCaretakerMutation.mutate,
    assignVendor: assignVendorMutation.mutate,
    addComment: addCommentMutation.mutate,
    addExpense: addExpenseMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isAssigningCaretaker: assignCaretakerMutation.isPending,
    isAssigningVendor: assignVendorMutation.isPending,
    isAddingComment: addCommentMutation.isPending,
    isAddingExpense: addExpenseMutation.isPending,
  };
};

export const useMaintenanceDashboard = () => {
  const { setError } = useMaintenanceStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['maintenance', 'dashboard'],
    queryFn: async () => {
      return maintenanceRepository.fetchDashboard();
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
  });

  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (err: any) {
      const message = err?.message || 'Failed to refresh dashboard';
      setError(message);
    }
  }, [refetch, setError]);

  return {
    stats: data || null,
    isLoading,
    error: error?.message || null,
    refresh,
  };
};
