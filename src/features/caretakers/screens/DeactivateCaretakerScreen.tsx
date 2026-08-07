import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCaretaker } from '../hooks';

export default function DeactivateCaretakerScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { caretaker, deactivateCaretaker, isDeactivating } = useCaretaker(Number(id));

  const handleDeactivate = async () => {
    await deactivateCaretaker(Number(id));
    router.back();
  };

  if (!caretaker) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['caretaker:write']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Deactivate Caretaker</Text>
            <Text style={[styles.description, { color: theme.subText }]}>
              Are you sure you want to deactivate <Text style={{ fontWeight: '600' }}>{caretaker.name}</Text>?
              This will mark them as inactive.
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.border }]}
                onPress={() => router.back()}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deactivateButton, { backgroundColor: theme.danger }]}
                onPress={handleDeactivate}
                disabled={isDeactivating}
              >
                <Text style={styles.deactivateButtonText}>
                  {isDeactivating ? 'Deactivating...' : 'Deactivate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  card: {
    padding: Spacing.lg,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  deactivateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deactivateButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
