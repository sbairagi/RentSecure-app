import { apiService } from '@/services/api/apiClient';
import { logger } from '@/services/api/logger';
import { useAuthStore } from '@/store/authStore';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { BootstrapUser } from '../types/bootstrap';

class PermissionService {
  async loadPermissions(): Promise<string[]> {
    try {
      const user = useAuthStore.getState().user;
      if (user?.permissions && user.permissions.length > 0) {
        logger.info('Permissions loaded from store', { count: user.permissions.length });
        return user.permissions;
      }

      const response = await apiService.get<any>(BOOTSTRAP_CONSTANTS.API_ENDPOINTS.PROFILE);
      const bootstrapUser = response?.user as BootstrapUser | undefined;

      if (bootstrapUser?.permissions) {
        useAuthStore.getState().setUser({
          ...useAuthStore.getState().user!,
          permissions: bootstrapUser.permissions,
        } as any);
        logger.info('Permissions loaded from API', { count: bootstrapUser.permissions.length });
        return bootstrapUser.permissions;
      }

      logger.warn('No permissions found in response');
      return [];
    } catch (error) {
      logger.error('Failed to load permissions', error as Error);
      const user = useAuthStore.getState().user;
      return user?.permissions || [];
    }
  }

  hasPermission(permissions: string[], requiredPermission: string): boolean {
    if (!requiredPermission) return true;
    if (!permissions || permissions.length === 0) return false;
    return permissions.includes(requiredPermission);
  }

  hasAnyPermission(permissions: string[], requiredPermissions: string[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!permissions || permissions.length === 0) return false;
    return requiredPermissions.some((perm) => permissions.includes(perm));
  }

  hasAllPermissions(permissions: string[], requiredPermissions: string[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!permissions || permissions.length === 0) return false;
    return requiredPermissions.every((perm) => permissions.includes(perm));
  }
}

export const permissionService = new PermissionService();
