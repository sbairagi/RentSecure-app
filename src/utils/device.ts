import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const device = {
  getDeviceId: async (): Promise<string> => {
    const parts = [
      Device.osVersion || '',
      Device.modelName || '',
      Platform.OS,
      Constants.expoConfig?.version || '',
    ];
    const id = parts.join('_').replace(/[^a-zA-Z0-9_]/g, '');
    const base64 = btoa(id).replace(/[^a-zA-Z0-9]/g, '');
    return `device_${base64.slice(0, 32)}`;
  },

  getDeviceInfo: async () => {
    const netState = await NetInfo.fetch();
    return {
      deviceId: await device.getDeviceId(),
      deviceModel: Device.modelName || 'Unknown',
      deviceName: Device.deviceName || 'Unknown',
      deviceType: Device.deviceType,
      platform: Platform.OS,
      osVersion: Device.osVersion || 'Unknown',
      appVersion: Constants.expoConfig?.version || '1.0.0',
      buildVersion: Constants.expoConfig?.runtimeVersion || '1',
      isEmulator: __DEV__ || false,
      isConnected: netState.isConnected ?? false,
      networkType: netState.type,
    };
  },

  isNetworkAvailable: async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  },

  getNetworkType: async (): Promise<string | null> => {
    const state = await NetInfo.fetch();
    return state.type === 'wifi' ? 'wifi' : state.type === 'cellular' ? 'cellular' : null;
  },
};
