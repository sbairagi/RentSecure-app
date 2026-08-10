import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { HttpsEnforcer } from '@/core/security/network/httpsEnforcer';

/**
 * Application environment configuration.
 *
 * Values are read from three sources, in order of precedence:
 *   1. Expo config `extra` block (populated by app.config.js from .env)
 *   2. process.env (available when running in Expo Go)
 *   3. Hardcoded fallback (should rarely be needed)
 *
 * HOW TO SWITCH BACKENDS
 * ----------------------
 * Set EXPO_PUBLIC_API_URL in your .env file:
 *
 *   .env.development  →  http://localhost:8000/api  (browser / same machine)
 *   .env.staging      →  https://api-staging.securenest.com/api
 *   .env.production   →  https://api.securenest.com/api
 *
 * For Expo Go on a physical iPhone/iPad, use your Mac's LAN IP:
 *   EXPO_PUBLIC_API_URL=http://192.168.1.4:8000/api
 *   (find it with: ipconfig getifaddr en0)
 *   Start Django: python manage.py runserver 0.0.0.0:8000
 *   Start Expo: expo start --lan
 *
 * PLATFORM-AWARE LOCALHOST
 * ------------------------
 * When running in a browser (web), `localhost` always refers to the same
 * machine Django is running on, so we auto-replace any LAN IP with
 * `http://localhost:8000/api` for convenience.
 */

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

/**
 * When running in a browser (web), the page itself loaded successfully
 * which proves the browser has connectivity. In that case, any LAN IP
 * in the API URL should be replaced with `localhost` because the browser
 * and Django are running on the same machine.
 *
 * On native (Expo Go / EAS build), the device may be on a different
 * machine, so the LAN IP must be preserved.
 */
function resolveApiUrl(rawUrl: string): string {
  if (Platform.OS !== 'web') return rawUrl;

  // Replace LAN IPs with localhost for web
  const localhostReplaced = rawUrl
    .replace(/https?:\/\/(192\.168\.\d+\.\d+):(\d+)/, 'http://localhost:$2')
    .replace(/https?:\/\/(10\.\d+\.\d+\.\d+):(\d+)/, 'http://localhost:$2')
    .replace(/https?:\/\/(172\.(1[6-9]|2[0-9]|3[01])\.\d+\.\d+):(\d+)/, 'http://localhost:$3');

  if (localhostReplaced !== rawUrl) {
    console.log('[Environment] Replaced LAN IP with localhost for web:', rawUrl, '→', localhostReplaced);
  }

  return localhostReplaced;
}

const appEnv = (getEnvValue('APP_ENV', 'development') as AppEnvironment) || 'development';

// Diagnostic: log resolved config so you can see in browser console what
// values were loaded from .env vs Constants.expoConfig.extra vs fallback.
console.log('[Environment] Resolved config:', {
  appEnv,
  apiUrl: resolveApiUrl(getEnvValue('API_URL', 'http://localhost:8000/api')),
  rawApiUrl: getEnvValue('API_URL', 'http://localhost:8000/api'),
  platform: Platform.OS,
  appName: getEnvValue('APP_NAME', 'SecureNest'),
  appVersion: getEnvValue('APP_VERSION', '1.0.0'),
  appScheme: getEnvValue('APP_SCHEME', 'securenest'),
  sentryDsn: getEnvValue('SENTRY_DSN', '') || '(empty)',
  enableAnalytics: getEnvBoolean('ENABLE_ANALYTICS', true),
  enableCrashReporting: getEnvBoolean('ENABLE_CRASH_REPORTING', true),
  enablePushNotifications: getEnvBoolean('ENABLE_PUSH_NOTIFICATIONS', true),
  googleMapsApiKey: getEnvValue('GOOGLE_MAPS_API_KEY', '') || '(empty)',
  expoConfigExtra: Constants.expoConfig?.extra
    ? {
        API_URL: Constants.expoConfig.extra.API_URL,
        APP_ENV: Constants.expoConfig.extra.APP_ENV,
        APP_SCHEME: Constants.expoConfig.extra.APP_SCHEME,
      }
    : '(not available - check app.config.js and .env file)',
});

export const environment: EnvironmentConfig = {
  appEnv,
  // The API base URL.
  // - On web: LAN IPs are auto-replaced with `localhost` because the
  //   browser runs on the same machine as Django.
  // - On native: the LAN IP is preserved so the phone can reach the Mac.
  apiUrl: (() => {
    const rawUrl = resolveApiUrl(getEnvValue('API_URL', 'http://localhost:8000/api'));
    const validation = HttpsEnforcer.validateApiBaseUrl(rawUrl);
    if (!validation.isValid) {
      throw new Error(
        `Invalid API URL: ${validation.error}. In production, API_URL must use HTTPS.`
      );
    }
    return validation.sanitizedUrl || rawUrl;
  })(),
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
