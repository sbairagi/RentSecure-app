import { environment } from '@/config/environment';
import { apiService } from '@/services/api/apiClient';
import { logger } from '@/services/api/logger';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { AppVersionInfo } from '../types/bootstrap';

class VersionService {
  private cachedVersion: AppVersionInfo | null = null;
  private lastChecked: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  async checkVersion(): Promise<AppVersionInfo> {
    const now = Date.now();
    if (this.cachedVersion && now - this.lastChecked < this.CACHE_DURATION) {
      return this.cachedVersion;
    }

    try {
      const response = await apiService.get<any>(BOOTSTRAP_CONSTANTS.API_ENDPOINTS.APP_VERSION);
      const versionInfo: AppVersionInfo = {
        latestVersion: response.latestVersion || '1.0.0',
        minSupportedVersion: response.minSupportedVersion || '1.0.0',
        isUpdateRequired: response.isUpdateRequired ?? false,
        isOptional: response.isOptional ?? false,
        storeUrl: response.storeUrl || undefined,
      };

      this.cachedVersion = versionInfo;
      this.lastChecked = now;

      logger.info('Version check completed', versionInfo);
      return versionInfo;
    } catch (error) {
      logger.error('Version check failed', error as Error);
      if (this.cachedVersion) {
        return this.cachedVersion;
      }
      return {
        latestVersion: environment.appVersion,
        minSupportedVersion: '1.0.0',
        isUpdateRequired: false,
        isOptional: false,
      };
    }
  }

  isVersionSupported(currentVersion: string, minSupported: string): boolean {
    const currentParts = currentVersion.split('.').map(Number);
    const minParts = minSupported.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, minParts.length); i++) {
      const current = currentParts[i] || 0;
      const min = minParts[i] || 0;
      if (current > min) return true;
      if (current < min) return false;
    }
    return true;
  }

  isForceUpdateRequired(versionInfo: AppVersionInfo): boolean {
    return versionInfo.isUpdateRequired;
  }

  clearCache(): void {
    this.cachedVersion = null;
    this.lastChecked = 0;
  }
}

export const versionService = new VersionService();
