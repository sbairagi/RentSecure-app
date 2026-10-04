import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { SECURITY_CONSTANTS } from '../constants';
import type { DeviceSecurityResult } from '../types';

export class DeviceSecurity {
  static async isRooted(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const buildTags = (await Device.getDeviceTypeAsync()) ? Device.osBuildId || '' : '';
      const rootedKeywords = [
        'test-keys',
        'su',
        'Magisk',
        'Xposed',
        'Frida',
        'busybox',
        'toybox',
      ];
      return rootedKeywords.some((keyword) =>
        buildTags.toLowerCase().includes(keyword.toLowerCase())
      );
    } catch {
      return false;
    }
  }

  static async isJailbroken(): Promise<boolean> {
    if (Platform.OS !== 'ios') return false;
    try {
      const pathsToCheck = [
        '/Applications/Cydia.app',
        '/usr/sbin/sshd',
        '/etc/apt',
        '/private/var/lib/apt',
        '/private/var/stash',
      ];

      for (const path of pathsToCheck) {
        try {
          const exists = await new Promise<boolean>((resolve) => {
            // eslint-disable-next-line global-require
            const fs = require('expo-file-system');
            fs.getInfoAsync(path).then(() => resolve(true)).catch(() => resolve(false));
          });
          if (exists) return true;
        } catch {
          // continue
        }
      }

      try {
        await SecureStore.getItemAsync('com.apple.springboard.debugstatus');
      } catch {
        // continue
      }

      return false;
    } catch {
      return false;
    }
  }

  static isEmulator(): boolean {
    if (Platform.OS === 'web') return false;
    const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
    const modelName = Device.modelName || '';
    const isEmulator =
      isDev ||
      modelName.includes('Emulator') ||
      modelName.includes('Android SDK') ||
      modelName.includes('iPhone Simulator');

    return isEmulator;
  }

  static async validateDevice(): Promise<DeviceSecurityResult> {
    const rooted = await this.isRooted();
    const jailbroken = await this.isJailbroken();
    const emulator = this.isEmulator();

    let reason: string | undefined;
    if (rooted) reason = 'Rooted device detected';
    else if (jailbroken) reason = 'Jailbroken device detected';
    else if (emulator) reason = 'Emulator not supported';

    return {
      allowed: !rooted && !jailbroken && !emulator,
      reason,
      isRooted: rooted,
      isJailbroken: jailbroken,
      isEmulator: emulator,
    };
  }

  static getDeviceInfo(): {
    deviceId: string;
    platform: string;
    osVersion: string;
    model: string;
    isEmulator: boolean;
  } {
    return {
      deviceId: (Device as any).deviceId || 'unknown',
      platform: Platform.OS,
      osVersion: Device.osVersion || 'unknown',
      model: Device.modelName || 'unknown',
      isEmulator: this.isEmulator(),
    };
  }
}
