import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { UnitImage } from '../types/units';

const UNIT_IMAGES_QUERY_KEY = (unitId: number | string) => ['units', unitId, 'images'];

export const useUnitImages = (unitId: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<UnitImage[]>({
    queryKey: UNIT_IMAGES_QUERY_KEY(unitId),
    queryFn: async () => {
      return [];
    },
    enabled: !!unitId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: UNIT_IMAGES_QUERY_KEY(unitId) });
  }, [unitId, queryClient]);

  return {
    images: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
