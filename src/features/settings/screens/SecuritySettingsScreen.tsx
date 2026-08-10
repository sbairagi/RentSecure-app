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
import { useBiometric, useChangePassword, useDeactivateAccount, useDeleteAccount, useLogout, useLogoutAllDevices } from '../hooks';

export default function SecuritySettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const logoutMutation = useLogout();
  const logoutAllMutation = useLogoutAllDevices();
  const changePasswordMutation = useChangePassword();
  const deactivateMutation = useDeactivateAccount();
  const deleteMutation = useDeleteAccount();
  const { setup: setupBiometric, disable: disableBiometric } = useBiometric();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

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

  const handleDeactivate = () => {
    deactivateMutation.mutate();
    setShowDeactivateConfirm(false);
  };

  const handleDelete = () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }
    deleteMutation.mutate();
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
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

        <Divider style={{ marginVertical: 8 }} />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Account
          </List.Subheader>
          <List.Item
            title="Deactivate Account"
            description="Temporarily disable your account"
            left={(props) => <List.Icon {...props} icon="account-off" color={theme.colors.error} />}
            onPress={() => setShowDeactivateConfirm(true)}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Delete Account"
            description="Permanently delete your account"
            left={(props) => <List.Icon {...props} icon="delete-forever" color={theme.colors.error} />}
            onPress={() => setShowDeleteConfirm(true)}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </List.Section>

        {showDeactivateConfirm ? (
          <View style={[styles.confirmContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.confirmText, { color: theme.colors.onSurface }]}>
              Are you sure you want to deactivate your account? You can reactivate it by logging in again.
            </Text>
            <View style={styles.confirmActions}>
              <Button mode="outlined" onPress={() => setShowDeactivateConfirm(false)} style={styles.confirmButton}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleDeactivate}
                loading={deactivateMutation.isPending}
                disabled={deactivateMutation.isPending}
                buttonColor={theme.colors.error}
                style={styles.confirmButton}
              >
                Deactivate
              </Button>
            </View>
          </View>
        ) : null}

        {showDeleteConfirm ? (
          <View style={[styles.confirmContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.confirmText, { color: theme.colors.onSurface }]}>
              This action cannot be undone. Type DELETE to confirm:
            </Text>
            <TextInput
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              mode="outlined"
              autoCapitalize="characters"
              style={styles.input}
              disabled={deleteMutation.isPending}
            />
            <View style={styles.confirmActions}>
              <Button mode="outlined" onPress={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} style={styles.confirmButton}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleDelete}
                loading={deleteMutation.isPending}
                disabled={deleteMutation.isPending || deleteConfirmText !== 'DELETE'}
                buttonColor={theme.colors.error}
                style={styles.confirmButton}
              >
                Delete
              </Button>
            </View>
          </View>
        ) : null}
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
  confirmContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  confirmText: {
    fontSize: 14,
    marginBottom: 12,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  confirmButton: {
    minWidth: 100,
  },
});
