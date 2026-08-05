import { apiService } from '@/services/api/apiClient';
import { logger } from '@/services/api/logger';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { DashboardSummary } from '../types/bootstrap';

class DashboardService {
  async loadDashboardSummary(): Promise<DashboardSummary | null> {
    try {
      const response = await apiService.get<any>(
        BOOTSTRAP_CONSTANTS.API_ENDPOINTS.DASHBOARD_SUMMARY
      );
      logger.info('Dashboard summary loaded');
      return response as DashboardSummary;
    } catch (error) {
      logger.error('Failed to load dashboard summary', error as Error);
      return null;
    }
  }
}

export const dashboardService = new DashboardService();
