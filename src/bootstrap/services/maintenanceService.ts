import { apiService } from '@/services/api/apiClient';
import { logger } from '@/services/api/logger';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { MaintenanceInfo } from '../types/bootstrap';

class MaintenanceService {
  private cachedMaintenance: MaintenanceInfo | null = null;
  private lastChecked: number = 0;
  private readonly CACHE_DURATION = 30 * 1000;

  async checkMaintenance(): Promise<MaintenanceInfo> {
    const now = Date.now();
    if (this.cachedMaintenance && now - this.lastChecked < this.CACHE_DURATION) {
      return this.cachedMaintenance;
    }

    try {
      const response = await apiService.get<any>(BOOTSTRAP_CONSTANTS.API_ENDPOINTS.MAINTENANCE);
      const maintenanceInfo: MaintenanceInfo = {
        isMaintenance: response.isMaintenance ?? false,
        message: response.message || BOOTSTRAP_CONSTANTS.ERROR_MESSAGES.maintenance,
        scheduledAt: response.scheduledAt || undefined,
      };

      this.cachedMaintenance = maintenanceInfo;
      this.lastChecked = now;

      logger.info('Maintenance check completed', maintenanceInfo);
      return maintenanceInfo;
    } catch (error) {
      logger.warn('Maintenance check failed', error as Error);
      if (this.cachedMaintenance) {
        return this.cachedMaintenance;
      }
      return {
        isMaintenance: false,
        message: '',
      };
    }
  }

  isUnderMaintenance(maintenanceInfo: MaintenanceInfo): boolean {
    return maintenanceInfo.isMaintenance;
  }

  clearCache(): void {
    this.cachedMaintenance = null;
    this.lastChecked = 0;
  }
}

export const maintenanceService = new MaintenanceService();
