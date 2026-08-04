import { APP_UPDATE_MESSAGES, AUTH_ERROR_MESSAGES } from '@/constants/auth.constants';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const loadBiometricModule = async () => {
  if (Platform.OS === 'web') return null;
  try {
    // eslint-disable-next-line import/no-unresolved
    return await import('expo-local-authentication');
  } catch {
    return null;
  }
};

export const security = {
  isDeviceSupported: (): boolean => {
    if (Platform.OS === 'web') return false;
    return true;
  },

  isRooted: async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    try {
      const buildTags = Device.osBuildId || '';
      const rootedKeywords = ['test-keys', 'su', 'Magisk', 'Xposed', 'Frida'];
      return rootedKeywords.some((keyword) =>
        buildTags.toLowerCase().includes(keyword.toLowerCase())
      );
    } catch {
      return false;
    }
  },

  isJailbroken: async (): Promise<boolean> => {
    if (Platform.OS !== 'ios') return false;
    try {
      const canOpen = await SecureStore.getItemAsync('is_jailbroken');
      if (canOpen) return true;
      return false;
    } catch {
      return false;
    }
  },

  isEmulator: (): boolean => {
    if (Platform.OS === 'web') return false;
    return (
      __DEV__ ||
      Device.modelName?.includes('Emulator') ||
      Device.modelName?.includes('Android SDK') ||
      false
    );
  },

  isBiometricAvailable: async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    try {
      const module = await loadBiometricModule();
      if (!module) return false;
      const compatible = await module.hasHardwareAsync();
      const enrolled = await module.isEnrolledAsync();
      return compatible && enrolled;
    } catch {
      return false;
    }
  },

  getBiometricType: async (): Promise<'faceid' | 'fingerprint' | 'none'> => {
    if (Platform.OS === 'web') return 'none';
    try {
      const module = await loadBiometricModule();
      if (!module) return 'none';
      const types = await module.supportedAuthenticationTypesAsync();
      if (types.includes(module.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'faceid';
      }
      if (types.includes(module.AuthenticationType.FINGERPRINT)) {
        return 'fingerprint';
      }
      return 'none';
    } catch {
      return 'none';
    }
  },

  isScreenshotAllowed: async (): Promise<boolean> => {
    return true;
  },

  validateDevice: async (): Promise<{ allowed: boolean; reason?: string }> => {
    if (!security.isDeviceSupported()) {
      return { allowed: false, reason: AUTH_ERROR_MESSAGES.DEVICE_NOT_SUPPORTED };
    }
    const rooted = await security.isRooted();
    if (rooted) {
      return { allowed: false, reason: AUTH_ERROR_MESSAGES.ROOTED_DEVICE };
    }
    const jailbroken = await security.isJailbroken();
    if (jailbroken) {
      return { allowed: false, reason: AUTH_ERROR_MESSAGES.JAILBROKEN_DEVICE };
    }
    const emulator = security.isEmulator();
    if (emulator) {
      return { allowed: false, reason: AUTH_ERROR_MESSAGES.DEVICE_NOT_SUPPORTED };
    }
    return { allowed: true };
  },

  getAppVersion: (): string => {
    return Constants.expoConfig?.version || '1.0.0';
  },

  getBuildNumber: (): string => {
    return (
      Constants.expoConfig?.ios?.buildNumber ||
      Constants.expoConfig?.android?.versionCode?.toString() ||
      '1'
    );
  },

  isDebugMode: (): boolean => {
    return __DEV__;
  },
};

export const network = {
  isConnected: async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  },

  getNetworkType: async (): Promise<string | null> => {
    const state = await NetInfo.fetch();
    return state.type;
  },
};

export const appUpdate = {
  compareVersions: (current: string, latest: string): number => {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const latestPart = latestParts[i] || 0;
      if (currentPart < latestPart) return -1;
      if (currentPart > latestPart) return 1;
    }
    return 0;
  },

  isUpdateRequired: (currentVersion: string, latestVersion: string): boolean => {
    return appUpdate.compareVersions(currentVersion, latestVersion) < 0;
  },

  getUpdateMessage: (isRequired: boolean): string => {
    return isRequired ? APP_UPDATE_MESSAGES.FORCE_UPDATE : APP_UPDATE_MESSAGES.OPTIONAL_UPDATE;
  },
};
