import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/design-system/buttons/Button';

interface CaretakerErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const CaretakerErrorState: React.FC<CaretakerErrorStateProps> = ({
  message = 'Failed to load caretakers',
  onRetry,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.icon, { color: theme.subText }]}>⚠️</Text>
      <Text style={[styles.title, { color: theme.text }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: theme.subText }]}>{message}</Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} variant="outlined" style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    minWidth: 120,
  },
});
