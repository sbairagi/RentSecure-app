import { useQuery } from '@tanstack/react-query';
import { buildingsRepository } from '../repository/buildingsRepository';
import type { BuildingAnalytics } from '../types/buildings';

export const useBuildingAnalytics = (id: number | string, userId?: number | string) => {
  return useQuery<BuildingAnalytics>({
    queryKey: ['owner', userId || 'current', 'building', id, 'analytics'],
    queryFn: () => buildingsRepository.fetchAnalytics(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};
