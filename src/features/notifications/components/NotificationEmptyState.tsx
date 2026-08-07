import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface NotificationEmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  title = 'No notifications',
  message = "You're all caught up!",
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔔</Text>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>{message}</Text>
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
