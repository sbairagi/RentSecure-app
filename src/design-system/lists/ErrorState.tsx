import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Please try again later',
  onRetry,
  retryLabel = 'Retry',
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.icon, { color: theme.colors.error[500] }]}>✕</Text>
      <Text style={[styles.title, { color: theme.colors.neutral[900] }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.neutral[500] }]}>{message}</Text>
      {onRetry && (
        <Text style={[styles.retryText, { color: theme.colors.primary[600] }]} onPress={onRetry}>
          {retryLabel}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xxl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
