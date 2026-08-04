import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

type DeviceType = 'phone' | 'tablet' | 'tv' | 'desktop' | 'unknown';
type DeviceStatus = 'normal' | 'rooted' | 'jailbroken' | 'emulator' | 'unsupported';

export interface DeviceInfoData {
  deviceId: string;
  deviceModel: string;
  deviceName: string;
  deviceType: DeviceType;
  platform: 'ios' | 'android' | 'web';
  osVersion: string;
  appVersion: string;
  buildVersion: string;
  isEmulator: boolean;
  isRooted: boolean;
  isJailbroken: boolean;
  status: DeviceStatus;
  isConnected: boolean;
  networkType: string | null;
}

const generateDeviceId = async (): Promise<string> => {
  const parts = [
    Device.osVersion || '',
    Device.modelName || '',
    Platform.OS,
    Constants.expoConfig?.version || '',
  ];
  const id = parts.join('_').replace(/[^a-zA-Z0-9_]/g, '');
  return `device_${btoa(id)
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 32)}`;
};

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const deviceId = await generateDeviceId();
        const netState = await NetInfo.fetch();
        const networkType =
          netState.type === 'wifi' ? 'wifi' : netState.type === 'cellular' ? 'cellular' : 'none';

        const info: DeviceInfoData = {
          deviceId,
          deviceModel: Device.modelName || 'Unknown',
          deviceName: Device.deviceName || 'Unknown',
          deviceType:
            Device.deviceType === Device.DeviceType.PHONE
              ? 'phone'
              : Device.deviceType === Device.DeviceType.TABLET
                ? 'tablet'
                : 'unknown',
          platform: Platform.OS as 'ios' | 'android' | 'web',
          osVersion: `${Device.osVersion} (${Device.osBuildId || ''})`,
          appVersion: Constants.expoConfig?.version || '1.0.0',
          buildVersion: (Constants.expoConfig?.runtimeVersion as string) || '1',
          isEmulator: __DEV__ || false,
          isRooted: false,
          isJailbroken: false,
          status: 'normal',
          isConnected: netState.isConnected ?? false,
          networkType,
        };

        setDeviceInfo(info);
      } catch (error) {
        console.error('Failed to fetch device info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceInfo();
  }, []);

  return {
    deviceInfo,
    isLoading,
    isRooted: deviceInfo?.isRooted || false,
    isJailbroken: deviceInfo?.isJailbroken || false,
    isEmulator: deviceInfo?.isEmulator || false,
    status: deviceInfo?.status || 'normal',
    isConnected: deviceInfo?.isConnected ?? false,
    networkType: deviceInfo?.networkType || null,
  };
};
