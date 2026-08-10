import Constants from 'expo-constants';
import { SECURITY_CONSTANTS } from '../constants';
import type { UrlValidationResult } from '../types';

export class HttpsEnforcer {
  static isSecureUrl(url: string | undefined | null): boolean {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'https:') return true;
      if (parsed.protocol === 'http:' && parsed.hostname === 'localhost') return true;
      if (parsed.protocol === 'http:' && parsed.hostname === '127.0.0.1') return true;
      return false;
    } catch {
      return false;
    }
  }

  static enforceHttps(url: string | undefined | null): UrlValidationResult {
    if (!url) {
      return { isValid: false, error: 'URL is required' };
    }

    try {
      const parsed = new URL(url);

      if (parsed.protocol === 'https:') {
        return { isValid: true, sanitizedUrl: url };
      }

      if (parsed.protocol === 'http:') {
        const isDev =
          Constants.expoConfig?.extra?.APP_ENV === 'development' ||
          process.env.EXPO_PUBLIC_APP_ENV === 'development';

        if (isDev && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
          return { isValid: true, sanitizedUrl: url };
        }

        return {
          isValid: false,
          error: `Insecure HTTP URL blocked in ${Constants.expoConfig?.extra?.APP_ENV || 'production'}: ${url}`,
        };
      }

      return {
        isValid: false,
        error: `Unsupported URL protocol: ${parsed.protocol}`,
      };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  static validateApiBaseUrl(url: string | undefined | null): UrlValidationResult {
    if (!url) {
      return { isValid: false, error: 'API URL is not configured' };
    }

    const result = this.enforceHttps(url);
    if (!result.isValid) {
      return result;
    }

    try {
      const parsed = new URL(url);
      if (!parsed.pathname || parsed.pathname === '/') {
        return { isValid: false, error: 'API URL must include a path prefix (e.g., /api)' };
      }
      return { isValid: true, sanitizedUrl: url };
    } catch {
      return { isValid: false, error: 'Invalid API URL format' };
    }
  }
}
