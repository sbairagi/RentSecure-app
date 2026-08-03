import Constants from 'expo-constants';

export type AppEnvironment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  appEnv: AppEnvironment;
  apiUrl: string;
  apiTimeout: number;
  apiRetryCount: number;
  appName: string;
  appVersion: string;
  appScheme: string;
  sentryDsn: string;
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  enablePushNotifications: boolean;
  googleMapsApiKey: string;
}

function getEnvValue(key: string, fallback: string = ''): string {
  const value = Constants.expoConfig?.extra?.[key] || process.env[key] || fallback;
  return typeof value === 'string' ? value : fallback;
}

function getEnvBoolean(key: string, fallback: boolean = false): boolean {
  const value = Constants.expoConfig?.extra?.[key] || process.env[key];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

function getEnvNumber(key: string, fallback: number): number {
  const value = Constants.expoConfig?.extra?.[key] || process.env[key];
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

const appEnv = (getEnvValue('APP_ENV', 'development') as AppEnvironment) || 'development';

export const environment: EnvironmentConfig = {
  appEnv,
  apiUrl: getEnvValue('API_URL', 'http://localhost:3000/api/v1'),
  apiTimeout: getEnvNumber('API_TIMEOUT', 30000),
  apiRetryCount: getEnvNumber('API_RETRY_COUNT', 3),
  appName: getEnvValue('APP_NAME', 'SecureNest'),
  appVersion: getEnvValue('APP_VERSION', '1.0.0'),
  appScheme: getEnvValue('APP_SCHEME', 'securenest'),
  sentryDsn: getEnvValue('SENTRY_DSN', ''),
  enableAnalytics: getEnvBoolean('ENABLE_ANALYTICS', true),
  enableCrashReporting: getEnvBoolean('ENABLE_CRASH_REPORTING', true),
  enablePushNotifications: getEnvBoolean('ENABLE_PUSH_NOTIFICATIONS', true),
  googleMapsApiKey: getEnvValue('GOOGLE_MAPS_API_KEY', ''),
};

export const isDevelopment = appEnv === 'development';
export const isStaging = appEnv === 'staging';
export const isProduction = appEnv === 'production';
