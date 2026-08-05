import type { BootstrapPhase, BootstrapProgress } from '../types/bootstrap';

export const BOOTSTRAP_PHASES: Record<BootstrapPhase, BootstrapProgress> = {
  idle: {
    phase: 'idle',
    label: 'idle',
    description: '',
  },
  checking_connectivity: {
    phase: 'checking_connectivity',
    label: 'connectivity',
    description: 'Checking internet connection...',
  },
  checking_maintenance: {
    phase: 'checking_maintenance',
    label: 'maintenance',
    description: 'Checking server status...',
  },
  checking_version: {
    phase: 'checking_version',
    label: 'version',
    description: 'Verifying app version...',
  },
  validating_session: {
    phase: 'validating_session',
    label: 'session',
    description: 'Validating session...',
  },
  refreshing_token: {
    phase: 'refreshing_token',
    label: 'token',
    description: 'Refreshing authentication...',
  },
  loading_user: {
    phase: 'loading_user',
    label: 'user',
    description: 'Loading user profile...',
  },
  loading_permissions: {
    phase: 'loading_permissions',
    label: 'permissions',
    description: 'Loading permissions...',
  },
  loading_subscription: {
    phase: 'loading_subscription',
    label: 'subscription',
    description: 'Loading subscription...',
  },
  loading_feature_limits: {
    phase: 'loading_feature_limits',
    label: 'limits',
    description: 'Loading feature limits...',
  },
  loading_addons: {
    phase: 'loading_addons',
    label: 'addons',
    description: 'Loading add-ons...',
  },
  loading_dashboard: {
    phase: 'loading_dashboard',
    label: 'dashboard',
    description: 'Loading dashboard...',
  },
  completed: {
    phase: 'completed',
    label: 'completed',
    description: 'Ready',
  },
  failed: {
    phase: 'failed',
    label: 'failed',
    description: 'Initialization failed',
  },
};

export const BOOTSTRAP_CONSTANTS = {
  API_ENDPOINTS: {
    BOOTSTRAP: '/auth/bootstrap/',
    MAINTENANCE: '/auth/maintenance/',
    APP_VERSION: '/auth/app/version/',
    REFRESH_TOKEN: '/api/token/refresh/',
    PROFILE: '/auth/profile/',
    SUBSCRIPTIONS: '/api/user-subscriptions/',
    ADDON_PURCHASES: '/api/addon-purchases/',
    USAGE_LIMITS: '/api/usage-limits/',
    DASHBOARD_SUMMARY: '/api/owner/dashboard-summary/',
  } as const,

  TIMEOUTS: {
    CONNECTIVITY_CHECK: 5000,
    MAINTENANCE_CHECK: 10000,
    VERSION_CHECK: 10000,
    TOKEN_REFRESH: 15000,
    PROFILE_LOAD: 10000,
    SUBSCRIPTION_LOAD: 10000,
    LIMITS_LOAD: 10000,
    ADDONS_LOAD: 10000,
    DASHBOARD_LOAD: 15000,
    TOTAL_BOOT_TIMEOUT: 60000,
  } as const,

  RETRY: {
    MAX_RETRIES: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 10000,
    BACKOFF_MULTIPLIER: 2,
    OFFLINE_RETRY_INTERVAL: 5000,
  } as const,

  SPLASH: {
    MIN_DISPLAY_TIME: 2000,
    MAX_DISPLAY_TIME: 8000,
    PROGRESS_UPDATE_INTERVAL: 150,
  } as const,

  PHASES_ORDER: [
    'checking_connectivity',
    'checking_maintenance',
    'checking_version',
    'validating_session',
    'refreshing_token',
    'loading_user',
    'loading_permissions',
    'loading_subscription',
    'loading_feature_limits',
    'loading_addons',
    'loading_dashboard',
  ] as const,

  ERROR_MESSAGES: {
    backend_down: 'Unable to connect to the server. Please check your internet connection.',
    maintenance: 'The app is currently under maintenance. Please check back later.',
    internet_lost: 'No internet connection. Please check your network and try again.',
    expired_token: 'Your session has expired. Please log in again.',
    version_unsupported: 'Please update the app to the latest version to continue.',
    permission_missing: 'You do not have permission to access this resource.',
    subscription_expired: 'Your subscription has expired. Please renew to continue.',
    feature_blocked: 'This feature requires an active subscription.',
    unknown: 'An unexpected error occurred. Please try again.',
  } as const,

  NAVIGATION: {
    WELCOME: '/(auth)/welcome',
    LOGIN: '/(auth)/login',
    SESSION_EXPIRED: '/(auth)/session-expired',
    MAINTENANCE: '/(auth)/maintenance',
    FORCE_UPDATE: '/(auth)/force-update',
    DASHBOARD: '/(drawer)/(tabs)/dashboard',
    SUBSCRIPTION: '/(drawer)/(tabs)/subscription',
  } as const,

  STORAGE_KEYS: {
    BOOTSTRAP_TIMESTAMP: 'bootstrap_timestamp',
    BOOTSTRAP_ERROR: 'bootstrap_error',
    OFFLINE_RETRY_COUNT: 'offline_retry_count',
  } as const,
} as const;

export type BootstrapApiEndpoints = typeof BOOTSTRAP_CONSTANTS.API_ENDPOINTS;
export type BootstrapTimeouts = typeof BOOTSTRAP_CONSTANTS.TIMEOUTS;
export type BootstrapRetryConfig = typeof BOOTSTRAP_CONSTANTS.RETRY;
export type BootstrapSplashConfig = typeof BOOTSTRAP_CONSTANTS.SPLASH;
export type BootstrapNavigationRoutes = typeof BOOTSTRAP_CONSTANTS.NAVIGATION;
export type BootstrapStorageKeys = typeof BOOTSTRAP_CONSTANTS.STORAGE_KEYS;
