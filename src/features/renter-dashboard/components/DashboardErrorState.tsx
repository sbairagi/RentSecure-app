import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface DashboardErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function DashboardErrorState({ message, onRetry }: DashboardErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 16 }}>
        Something went wrong
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          Try Again
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
  },
});