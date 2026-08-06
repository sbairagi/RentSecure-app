import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Platform } from 'react-native';
import { API_CONFIG } from './endpoints';
import { useGlobalLoaderStore } from './globalLoader';
import { logger } from './logger';
import { networkManager } from './networkManager';
import { requestQueue } from './requestQueue';
import type { SecureNestApiError } from './types';

export interface SecureNestAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  metadata?: {
    requestId?: string;
    startTime?: number;
  };
}

class ApiClient {
  private axiosInstance: ReturnType<typeof axios.create>;
  private requestIdCounter = 0;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': API_CONFIG.CONTENT_TYPE_JSON,
        Accept: API_CONFIG.ACCEPT_HEADER,
      },
    });

    this.setupInterceptors();
    this.setupNetworkMonitoring();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const requestId = `req_${++this.requestIdCounter}`;
        (config as SecureNestAxiosRequestConfig).metadata = {
          ...(config as SecureNestAxiosRequestConfig).metadata,
          requestId,
          startTime: Date.now(),
        };

        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `${API_CONFIG.BEARER_PREFIX}${token}`;
        }

        const metadata = await this.getRequestMetadata();
        if (config.headers) {
          config.headers[API_CONFIG.CORRELATION_ID_HEADER] = metadata.correlationId;
          config.headers[API_CONFIG.DEVICE_ID_HEADER] = metadata.deviceId;
          config.headers[API_CONFIG.APP_VERSION_HEADER] = metadata.appVersion;
          config.headers[API_CONFIG.PLATFORM_HEADER] = metadata.platform;
          config.headers[API_CONFIG.LANGUAGE_HEADER] = metadata.language;
          config.headers[API_CONFIG.TIMEZONE_HEADER] = metadata.timezone;
        }

        useGlobalLoaderStore.getState().increment();
        logger.logRequest(config, metadata.correlationId);

        return config;
      },
      (error) => {
        useGlobalLoaderStore.getState().decrement();
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        useGlobalLoaderStore.getState().decrement();
        const config = response.config as SecureNestAxiosRequestConfig;
        const duration = config.metadata?.startTime ? Date.now() - config.metadata.startTime : 0;
        const correlationId = config.headers?.[API_CONFIG.CORRELATION_ID_HEADER] as
          string | undefined;
        logger.logResponse(response, duration, correlationId);
        return response;
      },
      async (error: AxiosError) => {
        useGlobalLoaderStore.getState().decrement();

        if (axios.isCancel(error)) {
          logger.debug('Request cancelled');
          return Promise.reject(new Error('Request cancelled'));
        }

        if (!error.config) {
          logger.error('Request failed without config', error);
          return Promise.reject(createApiErrorFromAxios(error));
        }

        const config = error.config as SecureNestAxiosRequestConfig;

        if (error.response?.status === 401 && !config._retry) {
          return this.handleUnauthorized(error, config);
        }

        const retryAttempt = config._retryCount || 0;
        const isRetryable = this.isRetryableError(error);

        if (isRetryable.retryable && retryAttempt < API_CONFIG.RETRY_COUNT) {
          return this.retryRequest(config, error, retryAttempt);
        }

        return Promise.reject(createApiErrorFromAxios(error));
      }
    );
  }

  private async handleUnauthorized(
    error: AxiosError,
    config: SecureNestAxiosRequestConfig
  ): Promise<any> {
    const correlationId = config.headers?.[API_CONFIG.CORRELATION_ID_HEADER] as string | undefined;
    config._retry = true;

    try {
      const newToken = await this.refreshAccessToken();
      if (newToken && config.headers) {
        config.headers.Authorization = `${API_CONFIG.BEARER_PREFIX}${newToken}`;
      }
      return this.axiosInstance.request(config);
    } catch {
      logger.info('Token refresh failed - logging out', { correlationId });
      await this.clearAuthData();
      return Promise.reject(createApiErrorFromAxios(error, correlationId));
    }
  }

  private async retryRequest(
    config: SecureNestAxiosRequestConfig,
    error: AxiosError,
    attempt: number
  ): Promise<any> {
    const maxRetries = API_CONFIG.RETRY_COUNT;
    if (attempt >= maxRetries) {
      logger.error('Max retries exceeded', { url: config.url, attempt });
      return Promise.reject(createApiErrorFromAxios(error));
    }

    const delay = Math.min(
      API_CONFIG.RETRY_DELAY * Math.pow(2, attempt),
      API_CONFIG.MAX_RETRY_DELAY
    );
    logger.warn(`Retrying request (${attempt + 1}/${maxRetries})`, { url: config.url, delay });

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      config._retryCount = attempt + 1;
      return this.axiosInstance.request(config);
    } catch (retryError) {
      return this.retryRequest(config, retryError as AxiosError, attempt + 1);
    }
  }

  private isRetryableError(error: AxiosError): { retryable: boolean; attempt: number } {
    const status = error.response?.status;
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const retryableCodes = ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET'];

    const config = error.config as SecureNestAxiosRequestConfig | undefined;
    const attempt = config?._retryCount || 0;

    if (status && retryableStatuses.includes(status)) {
      return { retryable: true, attempt };
    }

    const errorCode = (error as any).code;
    if (errorCode && retryableCodes.includes(errorCode)) {
      return { retryable: true, attempt };
    }

    if (error.message?.includes('Network request failed')) {
      return { retryable: true, attempt };
    }

    return { retryable: false, attempt };
  }

  private async setupNetworkMonitoring(): Promise<void> {
    networkManager.startMonitoring();

    networkManager.subscribe(async (status) => {
      if (status === 'online') {
        logger.info('Network restored - processing queued requests');
        await requestQueue.processQueue();
      }
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const token = await this.getAccessToken();
    const response = await this.axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `${API_CONFIG.BEARER_PREFIX}${token}` : undefined,
      },
      timeout: 5 * 60 * 1000,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }
      },
    });
    return response.data;
  }

  cancelRequest(requestId: string): void {
    logger.debug('Cancel request', { requestId });
  }

  getAxiosInstance(): ReturnType<typeof axios.create> {
    return this.axiosInstance;
  }

  getBaseURL(): string {
    return API_CONFIG.BASE_URL;
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      const { MMKV } = await import('react-native-mmkv');
      const mmkv = new MMKV();
      return mmkv.getString('access_token') ?? null;
    } catch {
      return null;
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const { MMKV } = await import('react-native-mmkv');
      const mmkv = new MMKV();
      const refreshToken = mmkv.getString('refresh_token');

      if (!refreshToken) return null;

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.REFRESH_TOKEN_URL}`,
        { refresh: refreshToken },
        { timeout: API_CONFIG.TIMEOUT }
      );

      const { access, refresh: newRefreshToken } = response.data;
      mmkv.set('access_token', access);
      if (newRefreshToken) {
        mmkv.set('refresh_token', newRefreshToken);
      }

      return access;
    } catch (error) {
      logger.error('Token refresh failed', error as Error);
      return null;
    }
  }

  private async clearAuthData(): Promise<void> {
    try {
      const { MMKV } = await import('react-native-mmkv');
      const mmkv = new MMKV();
      mmkv.delete('access_token');
      mmkv.delete('refresh_token');
      mmkv.delete('auth_user');
    } catch (error) {
      logger.error('Failed to clear auth data', error as Error);
    }

    try {
      const { useAuthStore } = await import('@/store/authStore');
      useAuthStore.getState().clearSession();
    } catch (error) {
      logger.error('Auth store clear failed', error as Error);
    }
  }

  private async getRequestMetadata(): Promise<{
    correlationId: string;
    deviceId: string;
    appVersion: string;
    platform: string;
    language: string;
    timezone: string;
  }> {
    const { device } = await import('@/utils/device');
    const { environment } = await import('@/config/environment');

    let language = 'en';
    try {
      const { useLanguageStore } = await import('@/store/languageStore');
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
}

function createApiErrorFromAxios(error: AxiosError, correlationId?: string): SecureNestApiError {
  const status = error.response?.status;
  const data = error.response?.data;

  let message = (data as any)?.message || error.message || 'An unexpected error occurred';
  let code: SecureNestApiError['code'] = 'UNKNOWN';

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    code = 'TIMEOUT';
    message = 'The request timed out. Please try again.';
  } else if (
    !status &&
    (error.message?.includes('Network') || error.message?.includes('network'))
  ) {
    code = 'NETWORK_ERROR';
    message = 'Unable to connect to the server. Please check your internet connection.';
  } else if (status === 401) {
    code = 'UNAUTHORIZED';
  } else if (status === 403) {
    code = 'FORBIDDEN';
  } else if (status === 404) {
    code = 'NOT_FOUND';
  } else if (status === 409) {
    code = 'CONFLICT';
  } else if (status === 422) {
    code = 'VALIDATION_ERROR';
  } else if (status === 429) {
    code = 'RATE_LIMITED';
  } else if (status === 503) {
    code = 'MAINTENANCE';
  } else if (status && status >= 500) {
    code = 'SERVER_ERROR';
  }

  return {
    message,
    code,
    statusCode: status,
    details: (data as any)?.details || (data as any)?.errors,
    correlationId,
  };
}

function generateCorrelationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}`;
}

export const apiClient = new ApiClient();
export const apiService = apiClient;
export default apiClient;
