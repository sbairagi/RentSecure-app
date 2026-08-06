import { Spacing } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUnit } from '../hooks/useUnit';

export default function DeleteConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { unit, isLoading, deleteUnit } = useUnit(Number(id));
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUnit();
      router.replace('/(drawer)/(tabs)/units/list');
    } catch {
      // Error handled by hook
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.card, { backgroundColor: '#fff' }]}>
        <Text style={styles.icon}>🗑️</Text>
        <Text style={styles.title}>Delete Unit</Text>
        <Text style={styles.description}>
          Are you sure you want to delete unit &ldquo;{unit?.unit}&rdquo;? This action cannot be
          undone.
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: '#e5e7eb' }]}
            onPress={() => router.back()}
            disabled={deleting}
          >
            <Text style={[styles.cancelButtonText, { color: '#374151' }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: deleting ? '#9ca3af' : '#dc2626' }]}
            onPress={handleDelete}
            disabled={deleting}
          >
            <Text style={styles.deleteButtonText}>{deleting ? 'Deleting...' : 'Delete'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
