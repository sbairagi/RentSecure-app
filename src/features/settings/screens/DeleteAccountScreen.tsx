import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import type { DeleteAccountState } from '../types';

export default function DeleteAccountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [state, setState] = useState<DeleteAccountState>({
    step: 'idle',
  });
  const [confirmationText, setConfirmationText] = useState('');

  const handleDelete = () => {
    if (confirmationText !== 'DELETE') {
      setState({ step: 'error', error: 'Please type DELETE to confirm' });
      return;
    }
    setState({ step: 'deleting' });
    // Backend API not available - show message
    setTimeout(() => {
      setState({ step: 'error', error: 'Account deletion is not supported by the backend yet. Please contact support.' });
    }, 1500);
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Delete Account
          </Text>
        </View>

        <View style={[styles.warningContainer, { backgroundColor: theme.colors.errorContainer }]}>
          <IconButton icon="alert" size={24} iconColor={theme.colors.onErrorContainer} />
          <View style={styles.warningTextContainer}>
            <Text style={[styles.warningTitle, { color: theme.colors.onErrorContainer }]}>
              This action cannot be undone
            </Text>
            <Text style={[styles.warningText, { color: theme.colors.onErrorContainer }]}>
              Deleting your account will permanently remove all your data, properties, rent records, and documents. This action is irreversible.
            </Text>
          </View>
        </View>

        {state.step === 'error' && state.error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
            <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
              {state.error}
            </Text>
          </View>
        ) : null}

        {state.step === 'done' ? (
          <View style={[styles.successContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Text style={[styles.successText, { color: theme.colors.onTertiaryContainer }]}>
              Your account deletion request has been submitted.
            </Text>
          </View>
        ) : (
          <View style={styles.confirmationSection}>
            <Text style={[styles.confirmationText, { color: theme.colors.onSurface }]}>
              Type <Text style={{ fontWeight: '700' }}>DELETE</Text> to confirm:
            </Text>
            <TextInput
              value={confirmationText}
              onChangeText={setConfirmationText}
              mode="outlined"
              autoCapitalize="characters"
              style={styles.input}
              disabled={state.step === 'deleting'}
            />
            <Button
              mode="contained"
              onPress={handleDelete}
              loading={state.step === 'deleting'}
              disabled={state.step === 'deleting' || confirmationText !== 'DELETE'}
              buttonColor={theme.colors.error}
              style={styles.button}
            >
              Delete My Account
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
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
