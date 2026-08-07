import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface NotificationErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const NotificationErrorState: React.FC<NotificationErrorStateProps> = ({
  message = 'Failed to load notifications',
  onRetry,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😕</Text>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{message}</Text>
      {onRetry && (
        <Button mode="contained" onPress={onRetry} style={styles.button}>
          Try Again
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
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    minWidth: 120,
  },
});
