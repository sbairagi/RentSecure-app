import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { apiService } from '@/services/api/apiClient';
import type { UnitDocument } from '../types/units';

const UNIT_DOCUMENTS_QUERY_KEY = (unitId: number | string) => ['units', unitId, 'documents'];

export const useUnitDocuments = (unitId: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<UnitDocument[]>({
    queryKey: UNIT_DOCUMENTS_QUERY_KEY(unitId),
    queryFn: async () => {
      const response = await apiService.get<UnitDocument[]>('/api/unit-all-documents/');
      const allDocs = Array.isArray(response) ? response : [];
      return allDocs.filter((doc) => doc.unit === Number(unitId));
    },
    enabled: !!unitId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: UNIT_DOCUMENTS_QUERY_KEY(unitId) });
  }, [unitId, queryClient]);

  return {
    documents: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
