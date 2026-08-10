import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RentEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const RentEmptyState: React.FC<RentEmptyStateProps> = ({
  title = 'No rent records found',
  description = 'Rent records will appear here once created.',
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={styles.icon}>📋</Text>
      <Text style={[styles.title, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: theme.subText }]}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <Text style={[styles.actionButton, { color: theme.primary }]} onPress={onAction}>
          {actionLabel}
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
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  actionButton: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
  },
});
