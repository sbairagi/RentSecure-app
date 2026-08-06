import { Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Title } from 'react-native-paper';

interface AgreementEmptyStateProps {
  onAction?: () => void;
}

export default function AgreementEmptyState({ onAction }: AgreementEmptyStateProps) {
  const router = useRouter();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      router.push('/(drawer)/(tabs)/agreements/create');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📄</Text>
      <Title style={styles.title}>No Agreements Yet</Title>
      <Text style={styles.description}>
        Create your first rent agreement to manage lifecycle digitally.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleAction}>
        <Text style={styles.buttonText}>Create Agreement</Text>
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
