import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  Button,
  IconButton,
  List,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import { useRegisterDevice, useProfile } from '../hooks';
import { settingsApi } from '../api';
import type { DeviceInfo, DeviceTokenData } from '../types';
import Constants from 'expo-constants';

export default function ConnectedDevicesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const registerDevice = useRegisterDevice();
  // const { data: profile } = useProfile();
  const [deviceName, setDeviceName] = useState('');
  const [devices, setDevices] = useState<DeviceTokenData[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  const deviceId = Constants.sessionId || 'unknown';
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildVersion = String(
    Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || 1
  );

  const currentDevice: DeviceInfo = {
    deviceId,
    deviceModel: 'Unknown',
    deviceName: 'This Device',
    platform: Platform.OS as 'ios' | 'android' | 'web',
    osVersion: 'Unknown',
    appVersion,
    buildVersion,
    isCurrentDevice: true,
  };

  const loadDevices = async () => {
    try {
      const data = await settingsApi.listDevices();
      setDevices(data);
    } catch {
      setDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDevices();
  }, []);

  const handleRegister = () => {
    registerDevice.mutate({
      ...currentDevice,
      deviceName: deviceName || currentDevice.deviceName,
    });
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Connected Devices
          </Text>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Current Device
          </List.Subheader>
          <List.Item
            title={currentDevice.deviceName}
            description={`${currentDevice.platform} • ${currentDevice.appVersion} (${currentDevice.buildVersion})`}
            left={(props) => <List.Icon {...props} icon="cellphone" />}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </List.Section>

        <View style={styles.registerSection}>
          <Text style={[styles.registerTitle, { color: theme.colors.onSurface }]}>
            Register New Device
          </Text>
          <TextInput
            label="Device Name"
            value={deviceName}
            onChangeText={setDeviceName}
            mode="outlined"
            placeholder="e.g., Work Phone"
            style={styles.input}
            disabled={registerDevice.isPending}
          />
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={registerDevice.isPending}
            disabled={registerDevice.isPending}
            style={styles.button}
          >
            Register Device
          </Button>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Your Devices
          </List.Subheader>
          {loadingDevices ? (
            <List.Item
              title="Loading devices..."
              description="Please wait"
              left={(props) => <List.Icon {...props} icon="loading" />}
              style={{ backgroundColor: theme.colors.surface }}
            />
          ) : devices.length === 0 ? (
            <List.Item
              title="No devices found"
              description="Register a device to see it here"
              left={(props) => <List.Icon {...props} icon="information" />}
              style={{ backgroundColor: theme.colors.surface }}
            />
          ) : (
            devices.map((device) => (
              <List.Item
                key={device.id}
                title={device.device_id || `Device ${device.id}`}
                description={`${device.platform} • ${device.active ? 'Active' : 'Inactive'}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={device.active ? 'cellphone-check' : 'cellphone-off'}
                  />
                )}
                style={{ backgroundColor: theme.colors.surface }}
              />
            ))
          )}
        </List.Section>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  registerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  registerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});
