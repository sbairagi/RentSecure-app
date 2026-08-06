/**
 * Central API configuration for the SecureNest mobile app.
 *
 * This file is the single entry point for all API-related configuration.
 * It reads values from your .env files (via Expo config) and exposes:
 *   - The backend base URL
 *   - Timeout and retry settings
 *   - The configured Axios client (apiClient)
 *   - HTTP helper functions (get, post, put, patch, delete)
 *
 * HOW TO SWITCH BACKENDS
 * ----------------------
 * You only need to change ONE environment variable: EXPO_PUBLIC_API_URL.
 *
 *   Development (local Wi-Fi):
 *     .env.development  →  EXPO_PUBLIC_API_URL=http://192.168.1.4:8000/api
 *
 *   Staging:
 *     .env.staging      →  EXPO_PUBLIC_API_URL=https://api-staging.securenest.com/api
 *
 *   Production:
 *     .env.production   →  EXPO_PUBLIC_API_URL=https://api.securenest.com/api
 *
 * Then restart Expo with the matching env file:
 *   expo start --env-file .env.development
 *   expo start --env-file .env.staging
 *   expo start --env-file .env.production
 *
 * EXPO GO ON iPHONE
 * ----------------
 * - Set EXPO_PUBLIC_API_URL to your Mac's LAN IP (not localhost).
 *   Find it with: ipconfig getifaddr en0
 * - Start Django: python manage.py runserver 0.0.0.0:8000
 * - Start Expo: expo start --lan
 * - Scan QR with Expo Go on iPhone.
 *
 * DO NOT hardcode "localhost" or "127.0.0.1" in .env.development.
 * The iPhone cannot reach your Mac's localhost over Wi-Fi.
 */

import type { AxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from './endpoints';
import { apiClient } from './apiClient';

export { API_CONFIG, API_ENDPOINTS };
export { apiClient, apiService, default } from './apiClient';
export type { SecureNestAxiosRequestConfig } from './apiClient';

// ---------------------------------------------------------------------------
// Convenience HTTP methods
// ---------------------------------------------------------------------------
// These wrap the axios instance so callers don't need to import axios
// directly.  They automatically apply the base URL, timeout, auth headers,
// and retry logic configured in apiClient.ts.

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.get<T>(url, config);
}

export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.post<T>(url, data, config);
}

export async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.put<T>(url, data, config);
}

export async function patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.patch<T>(url, data, config);
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.delete<T>(url, config);
}
