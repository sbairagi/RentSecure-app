import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BulkOperationPayload } from '../types/units';

interface BulkActionsProps {
  selectedIds: number[];
  onAction: (action: BulkOperationPayload['action'], data?: Record<string, any>) => void;
  onClearSelection: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  onAction,
  onClearSelection,
}) => {
  const theme = useTheme();

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      <View style={styles.info}>
        <Text style={[styles.count, { color: theme.text }]}>{selectedIds.length} selected</Text>
        <TouchableOpacity onPress={onClearSelection}>
          <Text style={[styles.clearText, { color: theme.primary }]}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#dcfce7' }]}
          onPress={() => onAction('archive')}
        >
          <Text style={[styles.actionText, { color: '#16a34a' }]}>Archive</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#dbeafe' }]}
          onPress={() => onAction('update_status')}
        >
          <Text style={[styles.actionText, { color: '#2563eb' }]}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#fee2e2' }]}
          onPress={() => onAction('delete')}
        >
          <Text style={[styles.actionText, { color: '#dc2626' }]}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#fef3c7' }]}
          onPress={() => onAction('export')}
        >
          <Text style={[styles.actionText, { color: '#d97706' }]}>Export</Text>
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
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
