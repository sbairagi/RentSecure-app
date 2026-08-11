import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { settingsApi } from '../api';
import type { AlertPreferences, DeviceInfo, NotificationPreference, ProfileData, UpdateProfileData } from '../types';

export function useProfile() {
  return useQuery({
    queryKey: ['settings', 'profile'],
    queryFn: async () => {
      return settingsApi.getProfile();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData): Promise<ProfileData> => {
      return settingsApi.updateProfile(data);
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['settings', 'profile'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });

      try {
        const { useAuthStore } = require('@/store/authStore');
        const authStore = useAuthStore.getState();
        if (authStore.user && updatedProfile) {
          authStore.updateUser({
            fullName: updatedProfile.full_name,
            email: updatedProfile.email,
            phone: updatedProfile.phone,
            role: updatedProfile.role,
            permissions: updatedProfile.permissions,
            isPhoneVerified: updatedProfile.is_phone_verified,
            username: updatedProfile.username,
          } as any);
        }
      } catch {
        // best-effort sync to auth store
      }

      showMessage({
        message: 'Profile updated successfully',
        type: 'success',
      });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to update profile',
        type: 'danger',
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      return settingsApi.changePassword(data);
    },
    onSuccess: () => {
      showMessage({
        message: 'Password changed successfully',
        type: 'success',
      });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to change password',
        type: 'danger',
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return settingsApi.logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useLogoutAllDevices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return settingsApi.logoutAllDevices();
    },
    onSuccess: () => {
      queryClient.clear();
      showMessage({
        message: 'Logged out from all devices',
        type: 'success',
      });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to logout from all devices',
        type: 'danger',
      });
    },
  });
}

export function useDeactivateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return settingsApi.deactivateAccount();
    },
    onSuccess: () => {
      queryClient.clear();
      showMessage({
        message: 'Account deactivated successfully',
        type: 'success',
      });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to deactivate account',
        type: 'danger',
      });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return settingsApi.deleteAccount();
    },
    onSuccess: () => {
      queryClient.clear();
      showMessage({
        message: 'Account deleted successfully',
        type: 'success',
      });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to delete account',
        type: 'danger',
      });
    },
  });
}

export function useAlertPreferences() {
  return useQuery({
    queryKey: ['settings', 'alertPreferences'],
    queryFn: async () => {
      return settingsApi.getAlertPreferences();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useUpdateAlertPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: Partial<AlertPreferences>) => {
      return settingsApi.updateAlertPreferences(prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'alertPreferences'] });
      showMessage({
        message: 'Preferences updated',
        type: 'success',
      });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to update preferences',
        type: 'danger',
      });
    },
  });
}

export function useNotificationPreference() {
  return useQuery({
    queryKey: ['settings', 'notificationPreference'],
    queryFn: async () => {
      return settingsApi.getNotificationPreference();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: Partial<NotificationPreference>) => {
      return settingsApi.updateNotificationPreference(prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'notificationPreference'] });
      showMessage({
        message: 'Notification preferences updated',
        type: 'success',
      });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to update preferences',
        type: 'danger',
      });
    },
  });
}

export function useBiometric() {
  return {
    setup: useMutation({
      mutationFn: async () => {
        return settingsApi.setupBiometric();
      },
      onSuccess: () => {
        showMessage({ message: 'Biometric enabled', type: 'success' });
      },
      onError: (err: any) => {
        showMessage({
          message: err?.message || 'Failed to enable biometric',
          type: 'danger',
        });
      },
    }),
    disable: useMutation({
      mutationFn: async () => {
        return settingsApi.disableBiometric();
      },
      onSuccess: () => {
        showMessage({ message: 'Biometric disabled', type: 'success' });
      },
      onError: (err: any) => {
        showMessage({
          message: err?.message || 'Failed to disable biometric',
          type: 'danger',
        });
      },
    }),
  };
}

export function useRegisterDevice() {
  return useMutation({
    mutationFn: async (deviceInfo: DeviceInfo) => {
      return settingsApi.registerDevice(deviceInfo);
    },
    onSuccess: () => {
      showMessage({ message: 'Device registered', type: 'success' });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to register device',
        type: 'danger',
      });
    },
  });
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['settings', 'subscriptionPlans'],
    queryFn: async () => {
      return settingsApi.getSubscriptionPlans();
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}

export function useUserSubscription() {
  return useQuery({
    queryKey: ['settings', 'userSubscription'],
    queryFn: async () => {
      return settingsApi.getUserSubscription();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useAddOns() {
  return useQuery({
    queryKey: ['settings', 'addOns'],
    queryFn: async () => {
      return settingsApi.getAddOns();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useUsageLimits() {
  return useQuery({
    queryKey: ['settings', 'usageLimits'],
    queryFn: async () => {
      return settingsApi.getUsageLimits();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}
