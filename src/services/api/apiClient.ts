import NetInfo from '@react-native-community/netinfo';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { environment } from '@/config/environment';
import { secureStorage } from '@/services/storage/secureStorage';

const API_BASE_URL = environment.apiUrl;
const API_TIMEOUT = environment.apiTimeout;
const API_RETRY_COUNT = environment.apiRetryCount;

class ApiService {
  private axiosInstance: ReturnType<typeof axios.create>;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value?: string | PromiseLike<string>) => void;
    reject: (reason?: any) => void;
  }[] = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.handleRequest(config),
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => this.handleResponse(error)
    );
  }

  private async handleRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    const accessToken = await secureStorage.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  }

  private async handleResponse(error: AxiosError): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest || !originalRequest.url) {
      return Promise.reject(this.normalizeError(error));
    }

    if (originalRequest._retry) {
      return Promise.reject(this.normalizeError(error));
    }

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      return Promise.reject(new Error('No internet connection'));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(this.normalizeError(err)));
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const newAccessToken = await this.refreshAccessToken();
        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        this.flushQueue(newAccessToken ?? null);
        return this.axiosInstance(originalRequest);
      } catch (refreshError) {
        this.flushQueue(null, refreshError);
        await secureStorage.clearAuth();
        return Promise.reject(new Error('Session expired. Please login again.'));
      } finally {
        this.isRefreshing = false;
      }
    }

    if (error.response?.status && [500, 502, 503, 504].includes(error.response.status)) {
      return this.retryRequest(originalRequest);
    }

    return Promise.reject(this.normalizeError(error));
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await secureStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${API_BASE_URL}/token/refresh`, {
        refresh: refreshToken,
      });
      const { access, refresh: newRefreshToken } = response.data;
      await secureStorage.setAccessToken(access);
      if (newRefreshToken) {
        await secureStorage.setRefreshToken(newRefreshToken);
      }
      return access;
    } catch {
      return null;
    }
  }

  private async retryRequest(config: InternalAxiosRequestConfig, retryCount = 0): Promise<any> {
    if (retryCount >= API_RETRY_COUNT) {
      return Promise.reject(new Error('Max retries exceeded'));
    }

    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      const response = await this.axiosInstance(config);
      return response;
    } catch {
      return this.retryRequest(config, retryCount + 1);
    }
  }

  private flushQueue(token: string | null, error?: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else if (token) resolve(token);
      else reject(new Error('Token refresh failed'));
    });
    this.failedQueue = [];
  }

  private normalizeError(error: AxiosError | Error): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const message =
        (axiosError.response?.data as any)?.message ||
        axiosError.message ||
        'An unexpected error occurred';
      return new Error(message);
    }
    return error;
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  getAxiosInstance() {
    return this.axiosInstance;
  }
}

export const apiService = new ApiService();
export default apiService;
