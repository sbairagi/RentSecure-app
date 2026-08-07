import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  List,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import { useBiometric, useChangePassword, useLogout, useLogoutAllDevices } from '../hooks';

export default function SecuritySettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const logoutMutation = useLogout();
  const logoutAllMutation = useLogoutAllDevices();
  const changePasswordMutation = useChangePassword();
  const { setup: setupBiometric, disable: disableBiometric } = useBiometric();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      return;
    }
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordForm(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleLogoutAll = () => {
    logoutAllMutation.mutate();
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Security Settings
          </Text>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Authentication
          </List.Subheader>
          <List.Item
            title="Change Password"
            description="Update your account password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setShowPasswordForm(!showPasswordForm)}
            style={{ backgroundColor: theme.colors.surface }}
          />
          {showPasswordForm ? (
            <View style={[styles.passwordForm, { backgroundColor: theme.colors.surface }]}>
              <TextInput
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                disabled={changePasswordMutation.isPending}
              />
              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                disabled={changePasswordMutation.isPending}
              />
              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                disabled={changePasswordMutation.isPending}
              />
              <Button
                mode="contained"
                onPress={handleChangePassword}
                loading={changePasswordMutation.isPending}
                disabled={changePasswordMutation.isPending}
                style={styles.button}
              >
                Update Password
              </Button>
            </View>
          ) : null}
        </List.Section>

        <Divider style={{ marginVertical: 8 }} />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Biometric
          </List.Subheader>
          <List.Item
            title="Biometric Authentication"
            description="Use Face ID or fingerprint"
            left={(props) => <List.Icon {...props} icon="fingerprint" />}
            right={(props) => (
              <List.Icon
                {...props}
                icon={biometricEnabled ? 'check-circle' : 'circle-outline'}
              />
            )}
            onPress={() => {
              if (biometricEnabled) {
                disableBiometric.mutate();
                setBiometricEnabled(false);
              } else {
                setupBiometric.mutate();
                setBiometricEnabled(true);
              }
            }}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </List.Section>

        <Divider style={{ marginVertical: 8 }} />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Sessions
          </List.Subheader>
          <List.Item
            title="Logout"
            description="Logout from this device"
            left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            onPress={handleLogout}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Logout All Devices"
            description={logoutAllMutation.isPending ? 'Processing...' : 'Logout from all other devices'}
            left={(props) => <List.Icon {...props} icon="logout-variant" color={theme.colors.error} />}
            onPress={handleLogoutAll}
            disabled={logoutAllMutation.isPending}
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
  passwordForm: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});
