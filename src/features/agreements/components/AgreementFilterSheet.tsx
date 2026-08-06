import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AgreementFilters } from '../types';

interface AgreementFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: AgreementFilters;
  onApply: (filters: AgreementFilters) => void;
}

export default function AgreementFilterSheet({
  visible,
  onClose,
  filters,
  onApply,
}: AgreementFilterSheetProps) {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<AgreementFilters>(filters);

  if (!visible) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const reset: AgreementFilters = {};
    setLocalFilters(reset);
    onApply(reset);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Filter Agreements</Text>
          <TouchableOpacity onPress={onClose} accessible accessibilityRole="button" accessibilityLabel="Close filters">
            <Text style={[styles.closeText, { color: theme.subText }]}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Status</Text>
          <View style={styles.chipContainer}>
            {['draft', 'pending_signature', 'partially_signed', 'fully_signed', 'active', 'expired', 'terminated', 'cancelled'].map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      status: prev.status === status ? ('' as const) : (status as AgreementFilters['status']),
                    }))
                  }
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${status}`}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        localFilters.status === status ? '#4f46e5' : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: localFilters.status === status ? '#fff' : theme.text },
                    ]}
                  >
                    {status.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleReset}
            style={[styles.footerButton, { backgroundColor: theme.background }]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Reset filters"
          >
            <Text style={[styles.footerButtonText, { color: theme.text }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleApply}
            style={[styles.footerButton, { backgroundColor: '#4f46e5' }]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Apply filters"
          >
            <Text style={[styles.footerButtonText, { color: '#fff' }]}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.md,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 24,
  },
  content: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  footerButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
