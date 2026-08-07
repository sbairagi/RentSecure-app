import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/design-system/buttons/Button';

interface CaretakerEmptyStateProps {
  onAction?: () => void;
}

export const CaretakerEmptyState: React.FC<CaretakerEmptyStateProps> = ({ onAction }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.icon, { color: theme.subText }]}>🛡️</Text>
      <Text style={[styles.title, { color: theme.text }]}>No caretakers found</Text>
      <Text style={[styles.description, { color: theme.subText }]}>
        Get started by adding your first caretaker to manage your properties.
      </Text>
      {onAction && (
        <Button title="Add Caretaker" onPress={onAction} style={styles.button} />
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
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    minWidth: 160,
  },
});
