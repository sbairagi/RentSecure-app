import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface DocumentEmptyStateProps {
  onAction?: () => void;
}

export const DocumentEmptyState: React.FC<DocumentEmptyStateProps> = ({ onAction }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>
      <Text style={[styles.title, { color: theme.text }]}>No documents yet</Text>
      <Text style={[styles.description, { color: theme.subText }]}>
        Upload your first document to get started.
      </Text>
      {onAction && (
        <TouchableOpacity onPress={onAction} style={[styles.button, { backgroundColor: '#4f46e5' }]}>
          <Text style={styles.buttonText}>Upload Document</Text>
        </TouchableOpacity>
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
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
