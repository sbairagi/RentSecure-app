import React, { useState } from 'react';
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
import { useRegisterDevice } from '../hooks';
import type { DeviceInfo } from '../types';
import Constants from 'expo-constants';

export default function ConnectedDevicesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const registerDevice = useRegisterDevice();
  const [deviceName, setDeviceName] = useState('');

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
            Note
          </List.Subheader>
          <List.Item
            title="Device list API not yet available"
            description="Backend supports registration only"
            left={(props) => <List.Icon {...props} icon="information" />}
            style={{ backgroundColor: theme.colors.surface }}
          />
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
