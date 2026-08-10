import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { Button } from 'react-native-paper';

interface DocumentErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const DocumentErrorState: React.FC<DocumentErrorStateProps> = ({ message, onRetry }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={[styles.title, { color: theme.text }]}>Something went wrong</Text>
      <Text style={[styles.description, { color: theme.subText }]}>{message}</Text>
      {onRetry && (
        <Button mode="contained" onPress={onRetry} style={styles.retryButton}>
          Retry
        </Button>
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
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
  },
});
