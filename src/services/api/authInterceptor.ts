import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './endpoints';
import { createApiError } from './errorHandler';
import { attachRequestHeaders } from './interceptors';
import { logger } from './logger';
import { networkManager } from './networkManager';
import { requestQueue } from './requestQueue';
import { calculateRetryDelay, shouldRetry } from './retryPolicy';

interface SecureNestAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  metadata?: {
    requestId?: string;
    startTime?: number;
  };
}

export async function requestInterceptor(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const startTime = Date.now();

  (config as SecureNestAxiosRequestConfig).metadata = {
    ...(config as SecureNestAxiosRequestConfig).metadata,
    startTime,
  };

  const networkStatus = networkManager.getStatus();
  if (networkStatus === 'offline' && !['GET'].includes(config.method?.toUpperCase() || 'GET')) {
    logger.warn('Request queued - offline', { url: config.url, method: config.method });

    const queuedRequest = {
      url: config.url || '',
      method: (config.method?.toUpperCase() || 'GET') as
        'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      headers: config.headers as Record<string, string>,
      params: config.params,
      data: config.data,
    };

    await requestQueue.enqueue(queuedRequest);
    return Promise.reject(
      createApiError({
        message: 'Request queued - offline',
        code: 'NETWORK_ERROR',
      })
    );
  }

  try {
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `${API_CONFIG.BEARER_PREFIX}${token}`;
    }
  } catch (error) {
    logger.warn('Failed to get access token', error as Error);
  }

  await attachRequestHeaders(config);

  logger.logRequest(
    {
      method: config.method,
      url: config.url,
      headers: config.headers,
      params: config.params,
      data: config.data,
    },
    config.headers?.[API_CONFIG.CORRELATION_ID_HEADER] as string | undefined
  );

  return config;
}

export async function responseInterceptor(response: any): Promise<any> {
  const config = response.config as SecureNestAxiosRequestConfig;
  const duration = config.metadata?.startTime ? Date.now() - config.metadata.startTime : 0;
  const correlationId = config.headers?.[API_CONFIG.CORRELATION_ID_HEADER] as string | undefined;

  logger.logResponse(response, duration, correlationId);

  if (response.status === 204) {
    return response;
  }

  return response;
}

export async function responseErrorInterceptor(error: any): Promise<any> {
  const config = error.config as SecureNestAxiosRequestConfig | undefined;
  const correlationId = config?.headers?.[API_CONFIG.CORRELATION_ID_HEADER] as string | undefined;

  if (!config) {
    logger.error('Request failed without config', error as Error);
    return Promise.reject(createApiError(error, correlationId));
  }

  const duration = config.metadata?.startTime ? Date.now() - config.metadata.startTime : 0;
  logger.logError(error, { ...config, duration } as any, correlationId);

  if (error.response?.status === 401 && !config._retry) {
    try {
      const token = await getRefreshTokenFromStorage();
      if (!token) {
        await handleLogout();
        return Promise.reject(
          createApiError({
            message: 'Session expired. Please log in again.',
            code: 'UNAUTHORIZED',
            statusCode: 401,
            correlationId,
          })
        );
      }

      config._retry = true;

      const refreshResponse = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.REFRESH_TOKEN_URL}`,
        { refresh: token },
        { timeout: API_CONFIG.TIMEOUT }
      );

      const { access: newAccessToken, refresh: newRefreshToken } = refreshResponse.data;
      await saveTokens(newAccessToken, newRefreshToken || token);

      if (config.headers) {
        config.headers.Authorization = `${API_CONFIG.BEARER_PREFIX}${newAccessToken}`;
      }

      return axios.request(config);
    } catch {
      await handleLogout();
      return Promise.reject(
        createApiError({
          message: 'Session expired. Please log in again.',
          code: 'UNAUTHORIZED',
          statusCode: 401,
          correlationId,
        })
      );
    }
  }

  const retryable = shouldRetry(error, config._retryCount || 0);
  if (retryable) {
    const retryCount = (config._retryCount || 0) + 1;
    config._retryCount = retryCount;

    const delay = calculateRetryDelay(retryCount - 1);
    logger.warn(`Retrying request (attempt ${retryCount})`, { url: config.url, delay });

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      return axios.request(config);
    } catch {
      logger.error('Retry failed', { url: config.url, retryCount });
    }
  }

  const apiError = createApiError(error, correlationId);

  if (
    apiError.code === 'NETWORK_ERROR' &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || 'GET')
  ) {
    await requestQueue.enqueue({
      url: config.url || '',
      method: (config.method?.toUpperCase() || 'GET') as 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      headers: config.headers as Record<string, string>,
      params: config.params,
      data: config.data,
    });
  }

  return Promise.reject(apiError);
}

async function getAccessToken(): Promise<string | null> {
  try {
    const { MMKV } = await import('react-native-mmkv');
    const mmkv = new MMKV();
    return mmkv.getString('access_token') ?? null;
  } catch {
    return null;
  }
}

async function getRefreshTokenFromStorage(): Promise<string | null> {
  try {
    const { MMKV } = await import('react-native-mmkv');
    const mmkv = new MMKV();
    return mmkv.getString('refresh_token') ?? null;
  } catch {
    return null;
  }
}

async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  try {
    const { MMKV } = await import('react-native-mmkv');
    const mmkv = new MMKV();
    mmkv.set('access_token', accessToken);
    mmkv.set('refresh_token', refreshToken);
  } catch (error) {
    logger.error('Failed to save tokens', error as Error);
  }
}

async function handleLogout(): Promise<void> {
  try {
    const { useAuthStore } = await import('@/store/authStore');
    useAuthStore.getState().clearSession();
  } catch (error) {
    logger.error('Logout handler error', error as Error);
  }
}
