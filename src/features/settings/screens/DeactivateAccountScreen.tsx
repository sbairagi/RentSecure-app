import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import { useDeactivateAccount } from '../hooks';

export default function DeactivateAccountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const deactivateMutation = useDeactivateAccount();
  const [confirmed, setConfirmed] = useState(false);

  const handleDeactivate = () => {
    if (!confirmed) return;
    deactivateMutation.mutate();
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Deactivate Account
          </Text>
        </View>

        <View style={[styles.warningContainer, { backgroundColor: theme.colors.errorContainer }]}>
          <IconButton icon="alert" size={24} iconColor={theme.colors.onErrorContainer} />
          <View style={styles.warningTextContainer}>
            <Text style={[styles.warningTitle, { color: theme.colors.onErrorContainer }]}>
              Deactivate your account?
            </Text>
            <Text style={[styles.warningText, { color: theme.colors.onErrorContainer }]}>
              Your account will be temporarily disabled. You can reactivate it by logging in again. All your data will be preserved.
            </Text>
          </View>
        </View>

        {deactivateMutation.isError ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
            <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
              {(deactivateMutation.error as any)?.message || 'Failed to deactivate account'}
            </Text>
          </View>
        ) : null}

        {deactivateMutation.isSuccess ? (
          <View style={[styles.successContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Text style={[styles.successText, { color: theme.colors.onTertiaryContainer }]}>
              Your account has been deactivated.
            </Text>
          </View>
        ) : (
          <View style={styles.confirmationSection}>
            <Button
              mode="outlined"
              onPress={() => setConfirmed(!confirmed)}
              style={styles.confirmButton}
            >
              {confirmed ? 'Confirmed' : 'I understand, deactivate my account'}
            </Button>
            <Button
              mode="contained"
              onPress={handleDeactivate}
              loading={deactivateMutation.isPending}
              disabled={!confirmed || deactivateMutation.isPending}
              buttonColor={theme.colors.error}
              style={styles.button}
            >
              Deactivate Account
            </Button>
          </View>
        )}
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
  warningContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
  },
  successContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
  },
  confirmationSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },
  confirmButton: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
});
