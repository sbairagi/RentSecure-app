import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BulkActionsBarProps } from '../types';

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onExport,
  onNotify,
  onDelete,
  onMove,
  onClearSelection,
}) => {
  const theme = useTheme();

  if (selectedCount === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      <View style={styles.info}>
        <Text style={[styles.count, { color: theme.text }]}>{selectedCount} selected</Text>
        <TouchableOpacity onPress={onClearSelection}>
          <Text style={[styles.clearText, { color: theme.primary }]}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#dcfce7' }]}
          onPress={onExport}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Export selected"
        >
          <Text style={[styles.actionText, { color: '#16a34a' }]}>Export</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#dbeafe' }]}
          onPress={onNotify}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Notify selected"
        >
          <Text style={[styles.actionText, { color: '#2563eb' }]}>Notify</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#fef3c7' }]}
          onPress={onMove}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Move selected"
        >
          <Text style={[styles.actionText, { color: '#d97706' }]}>Move</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#fee2e2' }]}
          onPress={onDelete}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Delete selected"
        >
          <Text style={[styles.actionText, { color: '#dc2626' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
