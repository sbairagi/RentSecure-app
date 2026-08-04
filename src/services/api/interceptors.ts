import { Platform } from 'react-native';
import { API_CONFIG } from './endpoints';
import type { RequestMetadata } from './types';

let correlationIdCounter = 0;

export function generateCorrelationId(): string {
  correlationIdCounter += 1;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const counter = correlationIdCounter.toString(36);
  return `${timestamp}_${random}_${counter}`;
}

export async function getRequestMetadata(): Promise<RequestMetadata> {
  const { device } = await import('@/utils/device');
  const { environment } = await import('@/config/environment');
  const { useLanguageStore } = await import('@/store/languageStore');

  let language = 'en';
  try {
    const languageStore = useLanguageStore?.getState?.();
    if (languageStore?.language) {
      language = languageStore.language;
    }
  } catch {
    language = 'en';
  }

  return {
    correlationId: generateCorrelationId(),
    deviceId: await device.getDeviceId(),
    appVersion: environment.appVersion,
    platform: Platform.OS,
    language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };
}

export async function attachRequestHeaders(
  config: Record<string, any>
): Promise<Record<string, any>> {
  const metadata = await getRequestMetadata();

  if (!config.headers) {
    config.headers = {};
  }

  config.headers[API_CONFIG.CORRELATION_ID_HEADER] = metadata.correlationId;
  config.headers[API_CONFIG.DEVICE_ID_HEADER] = metadata.deviceId;
  config.headers[API_CONFIG.APP_VERSION_HEADER] = metadata.appVersion;
  config.headers[API_CONFIG.PLATFORM_HEADER] = metadata.platform;
  config.headers[API_CONFIG.LANGUAGE_HEADER] = metadata.language;
  config.headers[API_CONFIG.TIMEZONE_HEADER] = metadata.timezone;

  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = API_CONFIG.CONTENT_TYPE_JSON;
  }

  if (!config.headers.Accept) {
    config.headers.Accept = API_CONFIG.ACCEPT_HEADER;
  }

  return config;
}
