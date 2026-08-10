import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RentErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const RentErrorState: React.FC<RentErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={[styles.title, { color: theme.text }]}>
        Error
      </Text>
      <Text style={[styles.message, { color: theme.subText }]}>
        {message}
      </Text>
      {onRetry && (
        <Text style={[styles.retryButton, { color: theme.primary }]} onPress={onRetry}>
          Retry
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
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
  retryButton: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
  },
});
