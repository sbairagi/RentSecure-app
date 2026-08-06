import { environment } from '@/config/environment';
import { apiService } from '@/services/api/apiClient';
import { logger } from '@/services/api/logger';
import { useAuthStore } from '@/store/authStore';
import { Platform } from 'react-native';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import { useAppStore } from '../stores/appStore';
import type { BootstrapErrorType, BootstrapPhase, BootstrapResponse } from '../types/bootstrap';
import { connectivityService } from './connectivityService';
import { dashboardService } from './dashboardService';
import { featureLimitService } from './featureLimitService';
import { maintenanceService } from './maintenanceService';
import { permissionService } from './permissionService';
import { sessionService } from './sessionService';
import { subscriptionService } from './subscriptionService';
import { versionService } from './versionService';

const IS_WEB = Platform.OS === 'web';

type BootstrapStep = {
  phase: Exclude<BootstrapPhase, 'idle' | 'completed' | 'failed'>;
  execute: () => Promise<void>;
  skipOnOffline?: boolean;
  requiresAuth?: boolean;
};

class BootstrapService {
  private isRunning = false;
  private hasCompleted = false;
  private phaseListeners: Set<(phase: BootstrapPhase) => void> = new Set();

  subscribeToPhase(listener: (phase: BootstrapPhase) => void): () => void {
    this.phaseListeners.add(listener);
    return () => {
      this.phaseListeners.delete(listener);
    };
  }

  private notifyPhase(phase: BootstrapPhase): void {
    this.phaseListeners.forEach((listener) => {
      try {
        listener(phase);
      } catch (error) {
        logger.error('Phase listener error', error as Error);
      }
    });
  }

  async initialize(): Promise<{
    success: boolean;
    errorType?: BootstrapErrorType;
    errorMessage?: string;
    data?: BootstrapResponse;
  }> {
    if (this.hasCompleted) {
      logger.warn('Bootstrap already completed - returning cached state');
      return {
        success: useAppStore.getState().isInitialized,
        data: this.buildBootstrapResponse(useAppStore.getState()),
      };
    }

    if (this.isRunning) {
      logger.warn('Bootstrap already running');
      return {
        success: false,
        errorType: 'unknown',
        errorMessage: 'Bootstrap already in progress',
      };
    }

    this.isRunning = true;
    const store = useAppStore.getState();

    store.reset();
    store.setPhase('checking_connectivity');
    this.notifyPhase('checking_connectivity');

    try {
      const steps: BootstrapStep[] = [
        {
          phase: 'checking_connectivity',
          execute: async () => this.checkConnectivity(),
        },
        {
          phase: 'checking_maintenance',
          execute: async () => this.checkMaintenance(),
        },
        {
          phase: 'checking_version',
          execute: async () => this.checkVersion(),
        },
        {
          phase: 'validating_session',
          execute: async () => this.validateSession(),
          skipOnOffline: true,
        },
        {
          phase: 'refreshing_token',
          execute: async () => this.refreshToken(),
          skipOnOffline: true,
        },
        {
          phase: 'loading_user',
          execute: async () => this.loadUser(),
          requiresAuth: true,
          skipOnOffline: true,
        },
        {
          phase: 'loading_permissions',
          execute: async () => this.loadPermissions(),
          requiresAuth: true,
          skipOnOffline: true,
        },
        {
          phase: 'loading_subscription',
          execute: async () => this.loadSubscription(),
          requiresAuth: true,
          skipOnOffline: true,
        },
        {
          phase: 'loading_feature_limits',
          execute: async () => this.loadFeatureLimits(),
          requiresAuth: true,
          skipOnOffline: true,
        },
        {
          phase: 'loading_addons',
          execute: async () => this.loadAddOns(),
          requiresAuth: true,
          skipOnOffline: true,
        },
        {
          phase: 'loading_dashboard',
          execute: async () => this.loadDashboard(),
          requiresAuth: true,
          skipOnOffline: true,
        },
      ];

      for (const step of steps) {
        const currentStore = useAppStore.getState();
        const authStore = useAuthStore.getState();

        if (step.skipOnOffline && currentStore.isOnline === false) {
          logger.info(`Skipping ${step.phase} - offline`);
          continue;
        }

        if (step.requiresAuth && !authStore.isAuthenticated) {
          logger.info(`Skipping ${step.phase} - not authenticated`);
          continue;
        }

        currentStore.setPhase(step.phase);
        this.notifyPhase(step.phase);

        try {
          await step.execute();
        } catch (error: any) {
          const errorType = this.classifyError(error);
          const expectedFailure = ['internet_lost', 'backend_down', 'maintenance', 'version_unsupported', 'expired_token'].includes(errorType);

          if (expectedFailure) {
            logger.warn(`Bootstrap step failed: ${step.phase}`, { errorType, message: error?.message });
          } else {
            logger.error(`Bootstrap step failed: ${step.phase}`, error);
          }

          if (errorType === 'backend_down' || errorType === 'internet_lost') {
            store.setError(errorType, BOOTSTRAP_CONSTANTS.ERROR_MESSAGES[errorType]);
            return {
              success: false,
              errorType,
              errorMessage: BOOTSTRAP_CONSTANTS.ERROR_MESSAGES[errorType],
            };
          }

          if (errorType === 'expired_token') {
            store.setError(errorType, BOOTSTRAP_CONSTANTS.ERROR_MESSAGES.expired_token);
            return {
              success: false,
              errorType,
              errorMessage: BOOTSTRAP_CONSTANTS.ERROR_MESSAGES.expired_token,
            };
          }

          logger.warn(`Non-fatal error in ${step.phase}, continuing bootstrap`);
        }
      }

      store.setPhase('completed');
      this.notifyPhase('completed');
      store.setInitialized(true);

      const bootstrapData = this.buildBootstrapResponse(store);
      logger.info('Bootstrap completed successfully');
      this.hasCompleted = true;

      return { success: true, data: bootstrapData };
    } catch (error: any) {
      const errorType = this.classifyError(error);
      const errorMessage = error.message || BOOTSTRAP_CONSTANTS.ERROR_MESSAGES[errorType];
      store.setPhase('failed');
      this.notifyPhase('failed');
      store.setError(errorType, errorMessage);
      logger.error('Bootstrap failed', error);
      return { success: false, errorType, errorMessage };
    } finally {
      this.isRunning = false;
    }
  }

  private async checkConnectivity(): Promise<void> {
    const store = useAppStore.getState();
    console.log('[Bootstrap] checkConnectivity: start', {
      isWeb: IS_WEB,
      env: process.env.EXPO_PUBLIC_APP_ENV,
    });
    const isConnected = await connectivityService.isConnected();
    console.log('[Bootstrap] checkConnectivity: isConnected =', isConnected);
    logger.info('Connectivity check', { isConnected });

    // In development on web, skip the hard backend gate so the app is usable
    // without the Django server running. The backend-dependent screens will
    // still show their own errors when the API calls fail.
    const isDevWeb =
      IS_WEB && process.env.EXPO_PUBLIC_APP_ENV !== 'production';
    console.log('[Bootstrap] checkConnectivity: isDevWeb =', isDevWeb);
    if (isDevWeb) {
      store.setOnline(true);
      logger.info('Dev web mode: skipping hard backend availability gate');
      console.log('[Bootstrap] checkConnectivity: DEV WEB MODE - skipping backend gate');
      return;
    }

    const backendAvailable = isConnected
      ? await connectivityService.checkBackendAvailability(environment.apiUrl)
      : false;

    console.log('[Bootstrap] checkConnectivity: backendAvailable =', backendAvailable, 'url =', environment.apiUrl);
    logger.info('Backend availability check', {
      baseUrl: environment.apiUrl,
      backendAvailable,
      isOnline: isConnected && backendAvailable,
    });

    store.setOnline(isConnected && backendAvailable);

    if (!isConnected) {
      logger.warn('Device reports offline - throwing NO_INTERNET');
      console.log('[Bootstrap] checkConnectivity: THROW NO_INTERNET');
      throw new Error('NO_INTERNET');
    }
    if (!backendAvailable) {
      logger.warn('Backend unreachable - throwing BACKEND_DOWN');
      console.log('[Bootstrap] checkConnectivity: THROW BACKEND_DOWN');
      throw new Error('BACKEND_DOWN');
    }
  }

  private async checkMaintenance(): Promise<void> {
    const maintenanceInfo = await maintenanceService.checkMaintenance();
    const store = useAppStore.getState();

    store.setMaintenance(
      maintenanceInfo.isMaintenance,
      maintenanceInfo.message,
      maintenanceInfo.scheduledAt
    );

    if (maintenanceInfo.isMaintenance) {
      throw new Error('MAINTENANCE_MODE');
    }
  }

  private async checkVersion(): Promise<void> {
    const versionInfo = await versionService.checkVersion();
    const store = useAppStore.getState();

    store.setAppVersion(versionInfo.latestVersion);
    store.setBackendVersion(versionInfo.minSupportedVersion);

    if (versionInfo.isUpdateRequired) {
      store.setForceUpdate(true);
      throw new Error('FORCE_UPDATE');
    }

    const currentVersion = environment.appVersion;
    if (!versionService.isVersionSupported(currentVersion, versionInfo.minSupportedVersion)) {
      store.setForceUpdate(true);
      throw new Error('VERSION_UNSUPPORTED');
    }
  }

  private async validateSession(): Promise<void> {
    const authStore = useAuthStore.getState();
    const accessToken = authStore.accessToken;

    if (!accessToken) {
      logger.info('No access token - skipping session validation');
      return;
    }

    const result = await sessionService.validateAndRefresh(accessToken, authStore.refreshToken);

    if (!result.success) {
      if (result.shouldClearSession) {
        sessionService.clearSession();
      }
      // Only throw for actual auth errors; the catch block in initialize()
      // will classify and store the error for the UI to handle.
      throw new Error(result.errorType || 'SESSION_INVALID');
    }
  }

  private async refreshToken(): Promise<void> {
    const authStore = useAuthStore.getState();
    const refreshToken = authStore.refreshToken;
    if (!refreshToken) {
      logger.info('No refresh token available - skipping token refresh');
      return;
    }

    const result = await sessionService.refreshSession(refreshToken);
    if (!result.success) {
      throw new Error(result.errorType || 'TOKEN_REFRESH_FAILED');
    }
  }

  private async loadUser(): Promise<void> {
    const response = await apiService.get<any>(BOOTSTRAP_CONSTANTS.API_ENDPOINTS.PROFILE);
    const user = response?.user;

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    useAuthStore.getState().setUser(user as any);
    logger.info('User loaded', { userId: user.id, role: user.role });
  }

  private async loadPermissions(): Promise<void> {
    await permissionService.loadPermissions();
  }

  private async loadSubscription(): Promise<void> {
    await subscriptionService.loadSubscription();
  }

  private async loadFeatureLimits(): Promise<void> {
    await featureLimitService.loadFeatureLimits();
  }

  private async loadAddOns(): Promise<void> {
    await featureLimitService.loadAddOns();
  }

  private async loadDashboard(): Promise<void> {
    await dashboardService.loadDashboardSummary();
  }

  private classifyError(error: any): BootstrapErrorType {
    const message = (error?.message || '').toUpperCase();

    if (message.includes('NO_INTERNET') || message.includes('NETWORK')) return 'internet_lost';
    if (
      message.includes('BACKEND_DOWN') ||
      message.includes('ECONNREFUSED') ||
      message.includes('ENOTFOUND')
    )
      return 'backend_down';
    if (message.includes('MAINTENANCE')) return 'maintenance';
    if (message.includes('FORCE_UPDATE') || message.includes('VERSION_UNSUPPORTED'))
      return 'version_unsupported';
    if (
      message.includes('SESSION') ||
      message.includes('TOKEN') ||
      message.includes('EXPIRED') ||
      message.includes('401')
    )
      return 'expired_token';
    if (message.includes('403') || message.includes('PERMISSION')) return 'permission_missing';
    if (message.includes('SUBSCRIPTION')) return 'subscription_expired';
    if (message.includes('FEATURE') || message.includes('LIMIT')) return 'feature_blocked';

    if (error?.code === 'NETWORK_ERROR') return 'internet_lost';
    if (error?.statusCode === 503) return 'backend_down';
    if (error?.statusCode === 401) return 'expired_token';
    if (error?.statusCode === 403) return 'permission_missing';

    // Browser fetch TypeError: "Failed to fetch" — treat as backend down on web,
    // because the page itself loaded so the browser has connectivity.
    if (error?.name === 'TypeError' && message.includes('FAILED TO FETCH')) return 'backend_down';
    // AbortController aborts also indicate connectivity/timeout issues
    if (error?.name === 'AbortError' || message.includes('ABORTERROR')) return 'backend_down';

    return 'unknown';
  }

  private buildBootstrapResponse(
    store: ReturnType<typeof useAppStore.getState>
  ): BootstrapResponse {
    return {
      maintenance: {
        isMaintenance: store.isMaintenance,
        message: store.maintenanceMessage,
        scheduledAt: store.maintenanceScheduledAt,
      },
      appVersion: {
        latestVersion: store.appVersion,
        minSupportedVersion: store.backendVersion,
        isUpdateRequired: store.isForceUpdate,
        isOptional: false,
      },
      subscription: store.subscription,
      addOns: store.addons,
      featureLimits: store.featureLimits,
      dashboardSummary: store.dashboardSummary,
    };
  }

  abort(): void {
    this.isRunning = false;
    useAppStore.getState().setPhase('failed');
    this.notifyPhase('failed');
  }

  async retry(maxRetries = BOOTSTRAP_CONSTANTS.RETRY.MAX_RETRIES): Promise<boolean> {
    const store = useAppStore.getState();
    if (store.retryCount >= maxRetries) {
      logger.warn('Max bootstrap retries reached', { retryCount: store.retryCount });
      return false;
    }

    store.incrementRetry();
    logger.info(`Retrying bootstrap (attempt ${store.retryCount + 1}/${maxRetries})`);

    await new Promise((resolve) => setTimeout(resolve, BOOTSTRAP_CONSTANTS.RETRY.INITIAL_DELAY));

    const result = await this.initialize();
    return result.success;
  }
}

export const bootstrapService = new BootstrapService();
