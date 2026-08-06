import { Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title, Button } from 'react-native-paper';

interface DocumentEmptyStateProps {
  onAction?: () => void;
}

export default function DocumentEmptyState({ onAction }: DocumentEmptyStateProps) {
  const router = useRouter();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      router.push('/(drawer)/(tabs)/documents/upload');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📁</Text>
      <Title style={styles.title}>No Documents Yet</Title>
      <Text style={styles.description}>
        Upload your first document to manage it securely.
      </Text>
      <Button mode="contained" onPress={handleAction} style={styles.button}>
        Upload Document
      </Button>
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
  },
});
