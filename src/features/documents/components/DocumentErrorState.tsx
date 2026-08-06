import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DocumentErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function DocumentErrorState({ message, onRetry }: DocumentErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={[styles.title, { color: theme.text }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: theme.subText }]}>{message}</Text>
      {onRetry && (
        <Text
          onPress={onRetry}
          style={styles.retry}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Retry"
        >
          Tap to retry
        </Text>
      )}
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
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retry: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
});
