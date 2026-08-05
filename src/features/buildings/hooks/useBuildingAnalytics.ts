import { useQuery } from '@tanstack/react-query';
import { buildingsRepository } from '../repository/buildingsRepository';
import type { BuildingAnalytics } from '../types/buildings';

export const useBuildingAnalytics = (id: number | string) => {
  return useQuery<BuildingAnalytics>({
    queryKey: ['building', 'analytics', id],
    queryFn: () => buildingsRepository.fetchAnalytics(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};
