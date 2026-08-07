import { apiService } from '@/services/api/apiClient';
import type {
  AddOnPurchase,
  AlertPreferences,
  ChangePasswordData,
  DeviceInfo,
  NotificationPreference,
  ProfileData,
  SubscriptionPlan,
  UpdateProfileData,
  UsageLimit,
  UserSubscription,
} from '../types';
import { SETTINGS_ENDPOINTS } from './settingsEndpoints';

export const settingsApi = {
  getProfile: async (): Promise<ProfileData> => {
    const response = await apiService.get<{ user: ProfileData }>(SETTINGS_ENDPOINTS.PROFILE);
    return response.user;
  },

  updateProfile: async (data: UpdateProfileData): Promise<ProfileData> => {
    const response = await apiService.put<{ user: ProfileData }>(SETTINGS_ENDPOINTS.PROFILE, data);
    return response.user;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(SETTINGS_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  logout: async (): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(SETTINGS_ENDPOINTS.LOGOUT, {});
  },

  logoutAllDevices: async (): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(SETTINGS_ENDPOINTS.LOGOUT_ALL, {});
  },

  getAlertPreferences: async (): Promise<AlertPreferences> => {
    const response = await apiService.get<AlertPreferences>(
      SETTINGS_ENDPOINTS.NOTIFICATION_PREFERENCES_GET
    );
    return response;
  },

  updateAlertPreferences: async (
    preferences: Partial<AlertPreferences>
  ): Promise<{ success: boolean; message: string }> => {
    return apiService.post<{ success: boolean; message: string }>(
      SETTINGS_ENDPOINTS.NOTIFICATION_PREFERENCES,
      preferences
    );
  },

  getNotificationPreference: async (): Promise<NotificationPreference> => {
    const response = await apiService.get<NotificationPreference>(
      SETTINGS_ENDPOINTS.NOTIFICATION_PREFERENCES_GET
    );
    return response;
  },

  updateNotificationPreference: async (
    preferences: Partial<NotificationPreference>
  ): Promise<{ success: boolean; message: string }> => {
    return apiService.post<{ success: boolean; message: string }>(
      SETTINGS_ENDPOINTS.NOTIFICATION_PREFERENCES,
      preferences
    );
  },

  setupBiometric: async (): Promise<{ message: string; isBiometricEnabled: boolean }> => {
    return apiService.post<{ message: string; isBiometricEnabled: boolean }>(
      SETTINGS_ENDPOINTS.BIOMETRIC_SETUP,
      {}
    );
  },

  disableBiometric: async (): Promise<{ message: string; isBiometricEnabled: boolean }> => {
    return apiService.post<{ message: string; isBiometricEnabled: boolean }>(
      SETTINGS_ENDPOINTS.BIOMETRIC_DISABLE,
      {}
    );
  },

  registerDevice: async (deviceInfo: DeviceInfo): Promise<{ message: string }> => {
    return apiService.post<{ message: string }>(SETTINGS_ENDPOINTS.DEVICE_REGISTER, deviceInfo);
  },

  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiService.get<SubscriptionPlan[]>(SETTINGS_ENDPOINTS.SUBSCRIPTION_PLANS);
    return Array.isArray(response) ? response : [];
  },

  getUserSubscription: async (): Promise<UserSubscription | null> => {
    try {
      const response = await apiService.get<{ results?: UserSubscription[] } | UserSubscription>(
        SETTINGS_ENDPOINTS.USER_SUBSCRIPTION
      );
      if (Array.isArray(response)) {
        return response[0] || null;
      }
      return response as UserSubscription;
    } catch {
      return null;
    }
  },

  getAddOns: async (): Promise<AddOnPurchase[]> => {
    const response = await apiService.get<{ results?: AddOnPurchase[] } | AddOnPurchase[]>(
      SETTINGS_ENDPOINTS.ADD_ON_PURCHASES
    );
    if (Array.isArray(response)) {
      return response;
    }
    return (response as { results?: AddOnPurchase[] }).results || [];
  },

  getUsageLimits: async (): Promise<UsageLimit[]> => {
    const response = await apiService.get<{ results?: UsageLimit[] } | UsageLimit[]>(
      SETTINGS_ENDPOINTS.USAGE_LIMITS
    );
    if (Array.isArray(response)) {
      return response;
    }
    return (response as { results?: UsageLimit[] }).results || [];
  },

  getBootstrapData: async (): Promise<{
    maintenance: { isMaintenance: boolean; message?: string };
    appVersion: { isUpdateRequired: boolean; latestVersion: string };
    user?: ProfileData;
    subscription?: UserSubscription | null;
    addOns?: AddOnPurchase[];
    featureLimits?: UsageLimit[];
  }> => {
    return apiService.get(SETTINGS_ENDPOINTS.BOOTSTRAP);
  },
};
