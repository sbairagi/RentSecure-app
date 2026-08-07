import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCaretaker } from '../hooks';
import { CARETAKER_CONSTANTS } from '../constants/caretakerConstants';

export default function DeleteConfirmationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { caretaker, deleteCaretaker, isDeleting } = useCaretaker(Number(id));

  const handleDelete = async () => {
    await deleteCaretaker(Number(id));
    router.replace('/(drawer)/(tabs)/caretakers');
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
            <Text style={[styles.title, { color: theme.text }]}>Delete Caretaker</Text>
            <Text style={[styles.description, { color: theme.subText }]}>
              {CARETAKER_CONSTANTS.ERROR_MESSAGES.DELETE_CONFIRM}
            </Text>
            <Text style={[styles.caretakerName, { color: theme.text }]}>
              {caretaker.name}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.border }]}
                onPress={() => router.back()}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
               <TouchableOpacity
                 style={[styles.deleteButton, { backgroundColor: theme.danger }]}
                 onPress={handleDelete}
                 disabled={isDeleting}
               >
                <Text style={styles.deleteButtonText}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
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
  caretakerName: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
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
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
