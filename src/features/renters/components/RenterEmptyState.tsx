import { Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Title } from 'react-native-paper';

interface RenterEmptyStateProps {
  onAction?: () => void;
}

export default function RenterEmptyState({ onAction }: RenterEmptyStateProps) {
  const router = useRouter();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      router.push('/(drawer)/(tabs)/renters/add');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>👥</Text>
      <Title style={styles.title}>No Renters Yet</Title>
      <Text style={styles.description}>
        Add your first renter to get started with rent management.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleAction}>
        <Text style={styles.buttonText}>Add Renter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
